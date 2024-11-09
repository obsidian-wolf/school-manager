import { differenceInMinutes } from 'date-fns';

import { BadRequest } from '../../../infrastructure/common/errors';
import { getNexioUrl } from '../../../integrations/nexio/get_token';
import { getOrder, updateOrder } from '../../collection';
import { getPayOverTimeProductPrice } from '../../../resources/products';
import { getRunCardTransactionPayload } from '../../../integrations/nexio/get_run_card_transaction';
import { getPayOverTimeOrderPrice } from '../helpers';

export async function getNexioPayOverTimePaymentUrl(
	orderId: string,
	{ reset }: { reset: boolean } = { reset: false },
) {
	const order = await getOrder(orderId);

	if (order.status !== 'pending') {
		throw new BadRequest('Order already processed');
	}

	let { nexioPayOverTimeUrl: nexioInstallmentUrl } = order.session;

	if (
		reset ||
		!nexioInstallmentUrl ||
		differenceInMinutes(new Date(nexioInstallmentUrl.expiration), new Date()) < 10
	) {
		nexioInstallmentUrl = await getNexioUrl(
			getRunCardTransactionPayload({
				orderNumber: order._id.toString() + '-1',
				amount: getPayOverTimeOrderPrice(order, 0),
				personalInfo: order.personalInfo,
				isInitialPayment: true,
				items: order.products.map((orderProduct) => ({
					item: orderProduct.product.name,
					// description: string;
					quantity: 1,
					price: getPayOverTimeProductPrice(orderProduct.product, 0),
					type: 'sale',
				})),
			}),
		);

		order.session.nexioPayOverTimeUrl = nexioInstallmentUrl;
		await updateOrder(
			orderId,
			{ session: order.session },
			{
				action: 'set_nexio_url',
				nexioUrl: nexioInstallmentUrl,
			},
		);
	}

	return order.session.nexioPayOverTimeUrl!.url;
}
