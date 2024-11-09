import { format } from 'date-fns';
import fs from 'fs';
import { getWebUrl } from '../helpers/get_web_url';
import { orderCollection } from '../orders/collection';
import { PrescriberyReassessmentPaymentRequest } from '../orders/default/reassessment/prescribery/reassessment';
import { TrinityCommission } from '../orders/trinity/types';
import { Installment, Order } from '../orders/types';
import { paymentRequestCollection } from '../payment_requests/collection';
import { Address } from '../resources/address';
import { getProductFromName } from '../resources/products';
import { User } from '../resources/user';
import { genUuid } from '../utils/gen_uuid';
import { times } from '../utils/times';

function generateCSV(requests: any[]): string {
	// Define the CSV headers
	const headers = ['url', 'dueDate', 'index', 'email', 'firstName', 'lastName', 'product'];
	const csvRows = [];

	// Add headers to the CSV
	csvRows.push(headers.join(','));

	// Process each request
	for (const request of requests) {
		const values = headers.map((header) => {
			let value = (request as any)[header];

			// Handle undefined or null values
			if (value === undefined || value === null) {
				value = '';
			}

			// Convert value to string
			value = String(value);

			// Escape double quotes
			value = value.replace(/"/g, '""');

			// Wrap the value in double quotes if it contains special characters
			if (value.search(/("|,|\n)/g) >= 0) {
				value = `"${value}"`;
			}

			return value;
		});
		csvRows.push(values.join(','));
	}

	// Combine all rows into a single CSV string
	return csvRows.join('\n');
}

export async function getOldPaymentsAndInstallments() {
	let orders = await orderCollection
		.find({
			paymentRequestId: {
				$exists: true,
			},
		})
		.toArray();

	orders = orders.filter((o) =>
		o.installments.some((i) => i.dueDate && i.dueDate < new Date() && i.status === 'pending'),
	);

	const csv = generateCSV(
		orders.map((o) => {
			const installmentIndex = o.installments.findIndex((i) => i.status === 'pending');
			const installment = o.installments[installmentIndex];
			return {
				url: getWebUrl({
					path: '/installment',
					orderId: o._id.toString(),
					installmentId: installment!.id,
				}),
				dueDate: format(installment.dueDate!, 'yyyy-MM-dd'),
				index: installmentIndex,
				email: o.personalInfo.user.email,
				firstName: o.personalInfo.user.firstName,
				lastName: o.personalInfo.user.lastName,
				product: o.products?.[0].product.id,
			};
		}),
	);

	// write the csv to a file
	fs.writeFileSync('old_payments.csv', csv);

	// const outdatedOrders = newOrders
	// 	.filter((o) => {
	// 		if (!o.paymentRequestId) return false;
	// 		return o.installments.some((i) => i.status === 'pending');
	// 	})
	// 	.map((q) => {

	// 	});
}

export async function fixOldPayments() {
	let paymentRequests = await paymentRequestCollection
		.find({
			processed: true,
			refunded: {
				$ne: true,
			},
		})
		.toArray();

	paymentRequests = paymentRequests
		.filter(
			(p) =>
				(p.squareInstallments &&
					!p.squareInstallments.some((p) => p.stripe) &&
					p.squareInstallments.some((p) => p.date < new Date() && !p.paid)) ||
				(p.stripeInstallments &&
					p.stripeInstallments.some((s) => s.date < new Date() && !s.paid)),
		)
		.filter((p) => {
			if (p.partial) {
				const child = paymentRequests.find(
					(c) => c.parentId?.toString() === p._id.toString(),
				);
				if (child) {
					return false;
				}
			}
			return true;
		})
		.filter((p) => {
			const firstUnpaidInstallmentIndexSquare =
				p.squareInstallments?.findIndex((p) => p.date < new Date() && !p.paid) || -1;
			const firstUnpaidInstallmentIndexStripe =
				p.stripeInstallments?.findIndex((p) => p.date < new Date() && !p.paid) || -1;
			const firstUnpaidInstallmentIndex = Math.max(
				firstUnpaidInstallmentIndexSquare,
				firstUnpaidInstallmentIndexStripe,
			);

			const nexioPayment = p.nexioInstallments?.[firstUnpaidInstallmentIndex];
			return !nexioPayment || !nexioPayment.paid;
		});

	const orders = await orderCollection
		.find({
			paymentRequestId: {
				$in: paymentRequests.map((p) => p._id),
			},
		})
		.toArray();

	paymentRequests = paymentRequests.filter((p) => {
		const order = orders.find((o) => o.paymentRequestId?.toString() === p._id.toString());
		return !order;
	});

	for (const paymentRequest of paymentRequests) {
		const maxIndex =
			paymentRequest.squareInstallments?.length || paymentRequest.stripeInstallments?.length;

		if (!maxIndex) {
			throw new Error('No installments found');
		}
		const product = getProductFromName(
			paymentRequest.medication.name,
			paymentRequest.medication.tier,
		);
		if (!product) {
			throw new Error('Product not found');
		}
		const installments: Installment[] = times(maxIndex, (i) => {
			const squareInstallment = paymentRequest.squareInstallments?.[i];
			const stripeInstallment = paymentRequest.stripeInstallments?.[i];

			const date = squareInstallment?.date || stripeInstallment?.date;
			// const amount = squareInstallment?.amount || stripeInstallment?.amount;
			const paid = squareInstallment?.paid || stripeInstallment?.paid;
			const id = genUuid();

			const oldT = paymentRequest.trinityPayments?.payments?.[i];

			const trinityCommission: TrinityCommission = {
				dueDate: date,
				month: i,
			};
			if (oldT) {
				trinityCommission.saveOrder = oldT.result && {
					success: oldT.result,
				};
			}

			return {
				id,
				dueDate: date,
				amount: product.retailPrice,
				status: paid ? 'paid' : 'pending',
				payInFull: false,
				products: [
					{
						id: product.id,
						/**
						 * Price of one product in USD.  The sum of this must be equal to the amount of the installment.
						 */
						amount: product.retailPrice,
						/**
						 * Quantity of the product
						 */
						quantity: 1,
						// isUpgrade?: boolean;
						isUpgrade: false,
						trinityCommissions: [trinityCommission],
					},
				],
			};
		});

		const user: User = {
			wp: {},
			firstName: paymentRequest.user.firstName,
			middleName: paymentRequest.user.middleName,
			lastName: paymentRequest.user.lastName,
			email: paymentRequest.user.email,
			dealerId: paymentRequest.user.dealerId,
			dob: new Date(paymentRequest.user.dob),
			gender: paymentRequest.user.gender,
			phone: paymentRequest.user.phone,
		};
		const shipping: Address = {
			address: paymentRequest.user.address,
			city: paymentRequest.user.city,
			postcode: paymentRequest.user.postcode,
			stateCode: paymentRequest.user.stateCode as any,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			phone: user.phone,
		};
		const billing = shipping;

		const order: Order = {
			createdAt: paymentRequest.createdAt,
			// personalInfo: PersonalInfo;
			status: 'active',

			installments,
			products: [
				{
					product,
					status: 'active',
				},
			],

			logs: [],

			personalInfo: {
				billing,
				shipping,
				user,
			},

			/**
			 * A link to the old structure.
			 */
			paymentRequestId: paymentRequest._id,

			/**
			 * Temporary session data that can be cleared any time.
			 */
			session: {},
			/**
			 * Note that you can still make ad_hoc payments on both first_time and reassessment orders.
			 *
			 * ad_hoc orders are when payments are made to an order that does not exist in the system.
			 */
			prescribery: {
				request: paymentRequest.prescriberyRequest as PrescriberyReassessmentPaymentRequest,
			},
			type: 'reassessment',
		};

		// newOrders.push(order);
		await orderCollection.insertOne(order);
	}

	// const outdatedOrders = newOrders
	// 	.filter((o) => {
	// 		if (!o.paymentRequestId) return false;
	// 		return o.installments.some((i) => i.status === 'pending');
	// 	})
	// 	.map((q) => {
	// 		// return getWebUrl({
	// 		// 	path: '/installment',
	// 		// 	orderId: insertedId.toString(),
	// 		// 	installmentId: id,
	// 		// });
	// 	});

	return true;
}
