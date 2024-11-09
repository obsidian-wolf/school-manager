import { ObjectId } from 'mongodb';
import { BadRequest } from '../infrastructure/common/errors';
import { orderCollection } from '../orders/collection';
import { PrescriberyReassessmentPaymentRequest } from '../orders/default/reassessment/prescribery/reassessment';
import { Address } from '../resources/address';
import { getProductFromName } from '../resources/products';
import { User } from '../resources/user';
import { paymentRequestCollection } from './collection';

export async function createOrderFromPaymentRequest(paymentRequestId: string): Promise<string> {
	const existingOrder = await orderCollection.findOne({
		paymentRequestId: new ObjectId(paymentRequestId),
	});
	if (existingOrder) {
		return existingOrder._id.toString();
	}

	const paymentRequest = await paymentRequestCollection.findOne({
		_id: new ObjectId(paymentRequestId),
	});

	if (!paymentRequest) {
		throw new BadRequest('Payment request not found');
	}

	const product = getProductFromName(
		paymentRequest.medication.name,
		paymentRequest.medication.tier,
	);

	if (!product) {
		throw new BadRequest('Product not found');
	}

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

	const { insertedId } = await orderCollection.insertOne({
		createdAt: new Date(),
		status: paymentRequest.processed ? 'completed' : 'pending',
		products: [
			{
				product,
				status: 'active',
			},
		],
		personalInfo: {
			billing,
			shipping,
			user,
		},
		paymentRequestId: new ObjectId(paymentRequestId),
		logs: [
			{
				date: new Date(),
				action: 'create_order_from_payment_request',
				paymentRequestId: paymentRequestId,
			},
		],
		prescribery: {
			request: paymentRequest.prescriberyRequest as PrescriberyReassessmentPaymentRequest,
		},
		type: 'reassessment',
		installments: [],
		session: {},
	});
	return insertedId.toString();
}
