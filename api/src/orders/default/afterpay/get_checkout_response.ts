import { differenceInMinutes } from 'date-fns';
import { BadRequest } from '../../../infrastructure/common/errors';
import { checkout } from '../../../integrations/afterpay/checkout';
import config from '../../../config';
import { getOrder, updateOrder } from '../../collection';
import { getPayInFullOrderPrice } from '../helpers';
import { getPayInFullProductPrice } from '../../../resources/products';

export async function getAfterpayCheckoutResponse(orderId: string) {
	const order = await getOrder(orderId);

	if (order.status !== 'pending') {
		throw new BadRequest('Order already processed');
	}

	const {
		personalInfo: { billing },
	} = order;
	let { afterpayCheckoutResponse } = order.session;

	if (
		!afterpayCheckoutResponse ||
		differenceInMinutes(new Date(afterpayCheckoutResponse.expires), new Date()) < 10
	) {
		const amountToCharge = getPayInFullOrderPrice(order);

		// const { switchFrom } = paymentRequest.medication;
		// if (switchFrom) {
		// 	amountToCharge -= switchFrom.retailPrice * switchFrom.monthSupply;
		// }

		try {
			afterpayCheckoutResponse = await checkout({
				amount: {
					amount: amountToCharge.toFixed(2),
					currency: 'USD',
				},
				consumer: {
					email: billing.email,
					givenNames: `${billing.firstName}${billing.middleName ? ` ${billing.middleName}` : ''}`,
					surname: billing.lastName,
					phoneNumber: billing.phone,
				},
				merchantReference: orderId,
				billing: {
					name: `${billing.firstName} ${billing.lastName}`,
					line1: billing.address,
					// line2?: string;
					area1: billing.city, // city
					region: billing.stateCode, // state
					postcode: billing.postcode,
					countryCode: 'US',
					phoneNumber: billing.phone,
				},
				shipping: {
					name: `${billing.firstName} ${billing.lastName}`,
					line1: billing.address,
					// line2?: string;
					area1: billing.city, // city
					region: billing.stateCode, // state
					postcode: billing.postcode,
					countryCode: 'US',
					phoneNumber: billing.phone,
				},

				items: order.products.map((orderProduct) => ({
					name: orderProduct.product.name,
					// sku?: string;
					quantity: 1,
					// pageUrl?: string;
					// imageUrl?: string; TODO
					price: {
						amount: getPayInFullProductPrice(orderProduct.product).toFixed(2),
						currency: 'USD',
					},
					// categories?: string[][];
					// estimatedShipmentDate?: string; // 2023-08-01
					// preorder?: boolean;
				})),
				merchant: {
					redirectConfirmUrl: config.APP_URL + '/pay/afterpay/confirm?orderId=' + orderId,
					redirectCancelUrl: config.APP_URL + '/pay/afterpay/cancel?orderId=' + orderId,
					name: 'Ellie MD',
				},
			});
		} catch {
			throw new BadRequest('Failed to create Afterpay checkout');
		}

		const session = order.session;
		session.afterpayCheckoutResponse = afterpayCheckoutResponse;

		await updateOrder(
			orderId,
			{ session },
			{
				action: 'process_afterpay_checkout',
				...afterpayCheckoutResponse,
			},
		);
	}

	return order.session.afterpayCheckoutResponse;
}
