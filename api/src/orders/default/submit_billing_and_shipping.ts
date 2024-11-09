import { BadRequest } from '../../infrastructure/common/errors';
import { Address } from '../../resources/address';
import { getOrder, updateOrder } from '../collection';

export type BillingAndShippingInfoRequest = {
	shipping: Address;
	billing: Address;
};

export async function submitBillingAndShipping(
	orderId: string,
	{ shipping, billing }: BillingAndShippingInfoRequest,
) {
	const order = await getOrder(orderId);

	if (order.status !== 'pending') {
		throw new BadRequest('Order is not pending');
	}

	order.personalInfo.user.firstName = billing.firstName;
	order.personalInfo.user.lastName = billing.lastName;
	order.personalInfo.user.phone = billing.phone;
	order.personalInfo.user.middleName = billing.middleName;

	order.personalInfo.shipping = shipping;
	order.personalInfo.billing = billing;

	await updateOrder(orderId, order, {
		action: 'submit_billing_shipping',
		shipping,
		billing,
	});
}
