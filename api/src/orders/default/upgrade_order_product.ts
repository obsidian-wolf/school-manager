import {
	getPayInFullProductPrice,
	getPayOverTimeProductPrice,
	getProductFromId,
	Product,
	ProductId,
} from '../../resources/products';

import { getOrder, updateOrder } from '../collection';
import { BadRequest } from '../../infrastructure/common/errors';
import { genUuid } from '../../utils/gen_uuid';
import { CardToken, getAllNexioCardTokens } from '../../integrations/nexio/get_card_tokens';
import { getPaymentDetails, PaymentDetails } from '../../integrations/nexio/get_payment_details';
import {
	processCard,
	ProcessCard,
	ProcessCardResponse,
} from '../../integrations/nexio/process_card';
import { getRunCardTransactionPayload } from '../../integrations/nexio/get_run_card_transaction';
import { Order, OrderProduct } from '../types';
import { WithId } from 'mongodb';

export type UpgradeOrderProduct = {
	orderId: string;
	originalProductId: ProductId;
	upgradedProductId: ProductId;
};

export async function upgradeOrderProduct(action: UpgradeOrderProduct): Promise<string> {
	const { orderId, originalProductId, upgradedProductId } = action;

	const order = await getOrder(orderId);

	if (order.status === 'voided') {
		throw new BadRequest('Order already voided');
	}
	if (order.status === 'cancelled') {
		throw new BadRequest('Order already cancelled');
	}

	const originalOrderProduct = order.products.find(
		(product) =>
			product.product.id === originalProductId &&
			product.status !== 'voided' &&
			product.status !== 'cancelled' &&
			product.status !== 'upgraded',
	);
	if (!originalOrderProduct) {
		throw new BadRequest('Original product not found');
	}

	const upgradedProduct = getProductFromId(upgradedProductId);
	if (!upgradedProduct) {
		throw new BadRequest('Upgraded product not found');
	}

	originalOrderProduct.status = 'upgraded';

	const upgradedOrderProduct: OrderProduct = {
		product: upgradedProduct,
		status: 'active',
		upgradedFrom: originalOrderProduct.product.id,
	};

	order.installments.forEach((installment) => {
		if (installment.products.some((p) => p.id === originalProductId) && installment.payInFull) {
			installment.payInFull = false;
		}
	});

	// TODO: do upgrade link if no nexio payment
	const chargeCard = getChargeCard(
		order,
		upgradedProduct,
		await getCardTokenFromNexioInstallments(order),
	);

	let amountToChargeNow: number;

	if (
		// either the upgraded product cannot be paid over time
		!upgradedProduct.payOverTimePlan ||
		// or the original wasn't paid in installments
		order.status === 'completed'
		// so we charge the full difference
	) {
		upgradedOrderProduct.status = 'completed';

		amountToChargeNow =
			getPayInFullProductPrice(upgradedProduct) -
			getPayInFullProductPrice(originalOrderProduct.product);

		const product = {
			amount: amountToChargeNow,
			id: upgradedProductId,
			quantity: 1,
			isUpgrade: true,
			// upgrading does not affect commissions
			trinityCommissions: [],
		};
		order.installments.push({
			id: genUuid(),
			status: 'paid',
			amount: amountToChargeNow,
			dueDate: new Date(),
			products: [product],
			payment: {
				type: 'nexio',
				processCardResponse: await chargeCard(amountToChargeNow),
				date: new Date(),
			},
			payInFull: true,
		});
		order.status = 'completed';
	} else {
		// this means the product was paid in installments, it was not completed, and the current
		// product is an installment product
		const payOverTimeMonthlyBalance =
			getPayOverTimeProductPrice(upgradedProduct, 0) -
			getPayOverTimeProductPrice(originalOrderProduct.product, 0);

		for (const installment of order.installments) {
			if (installment.products.some((product) => product.id === originalProductId)) {
				if (installment.status === 'pending') {
					installment.amount += payOverTimeMonthlyBalance;
				}
			}
		}

		const timesAlreadyPaid = order.installments.filter(
			(installment) =>
				installment.status === 'paid' &&
				installment.products.some((product) => product.id === originalProductId),
		).length;
		amountToChargeNow = timesAlreadyPaid * payOverTimeMonthlyBalance;

		const product = {
			amount: amountToChargeNow,
			id: originalProductId,
			quantity: 1,
			isUpgrade: true,
			trinityCommissions: [],
		};
		order.installments.push({
			id: genUuid(),
			status: 'paid',
			amount: product.amount,
			dueDate: new Date(),
			products: [product],
			payment: {
				type: 'nexio',
				processCardResponse: await chargeCard(amountToChargeNow),
				date: new Date(),
			},
			payInFull: false,
		});
		order.status = 'active';
	}

	order.products.push(upgradedOrderProduct);

	order.session = {};

	await updateOrder(orderId, order, {
		action: 'upgrade_order_product',
		...action,
	});

	return `Successfully ugpraded and charged ${amountToChargeNow}`;
}

function getChargeCard(order: WithId<Order>, upgradedProduct: Product, cardToken: CardToken) {
	return async (amount: number) => {
		const payload: ProcessCard = {
			...getRunCardTransactionPayload({
				orderNumber: order._id.toString(),
				amount,
				personalInfo: order.personalInfo,
				isInitialPayment: true,
				items: [
					{
						item: upgradedProduct.name,
						// description: string;
						quantity: 1,
						price: amount,
						type: 'sale',
					},
				],
			}),
			tokenex: {
				token: cardToken.token,
			},
		};
		let processCardResponse: ProcessCardResponse;
		try {
			processCardResponse = await processCard(payload);
		} catch {
			throw new BadRequest('Error processing card');
		}
		return processCardResponse;
	};
}

export async function getCardTokenFromNexioInstallments(order: Order) {
	// find last installment where paid in nexio
	// if not found, throw error
	const existingNexioInstallment = order.installments
		.filter(
			(installment) =>
				installment.payment?.type === 'nexio' &&
				installment.status === 'paid' &&
				installment.payment.paymentId,
		)
		.pop();

	if (
		existingNexioInstallment?.payment?.type !== 'nexio' ||
		!existingNexioInstallment.payment.paymentId
	) {
		throw new BadRequest('No nexio paymentId found');
	}

	let paymentDetails: PaymentDetails;
	try {
		paymentDetails = await getPaymentDetails(existingNexioInstallment.payment.paymentId);
	} catch {
		throw new BadRequest('Error getting payment details');
	}
	existingNexioInstallment.payment.paymentDetails = paymentDetails;

	const cardTokens = await getAllNexioCardTokens(order.personalInfo.user.email);

	const firstSix = paymentDetails.cardNumber.slice(0, 6);
	const lastFour = paymentDetails.cardNumber.slice(-4);
	// const cardHolder = paymentDetails.cardHolder;
	const cardToken = cardTokens.find(
		(cardToken) => cardToken.firstSix === firstSix && cardToken.lastFour === lastFour,
		// cardToken.cardHolderName === cardHolder,
	);
	if (!cardToken) {
		throw new BadRequest('Card token not found');
	}

	return cardToken;
}
