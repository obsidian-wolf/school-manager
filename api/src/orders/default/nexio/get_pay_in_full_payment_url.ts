import { differenceInMinutes } from 'date-fns';

import { BadRequest } from '../../../infrastructure/common/errors';
import { getNexioUrl } from '../../../integrations/nexio/get_token';
import { getOrder, updateOrder } from '../../collection';
import { getPayInFullOrderPrice } from '../helpers';
import { getPayInFullProductPrice } from '../../../resources/products';
import { getRunCardTransactionPayload } from '../../../integrations/nexio/get_run_card_transaction';

export async function getNexioPayInFullPaymentUrl(
	orderId: string,
	{ reset }: { reset: boolean } = { reset: false },
) {
	const order = await getOrder(orderId);

	if (order.status !== 'pending') {
		throw new BadRequest('Order already processed');
	}

	let { nexioPayInFullUrl: nexioUrl } = order.session;

	if (reset || !nexioUrl || differenceInMinutes(new Date(nexioUrl.expiration), new Date()) < 10) {
		nexioUrl = await getNexioUrl(
			getRunCardTransactionPayload({
				orderNumber: order._id.toString(),
				amount: getPayInFullOrderPrice(order),
				personalInfo: order.personalInfo,
				isInitialPayment: true,
				items: order.products.map((orderProduct) => ({
					item: orderProduct.product.name,
					// description: string;
					quantity: 1,
					price: getPayInFullProductPrice(orderProduct.product),
					type: 'sale',
				})),
			}),
		);

		order.session.nexioPayInFullUrl = nexioUrl;
		await updateOrder(
			orderId,
			{ session: order.session },
			{
				action: 'set_nexio_url',
				nexioUrl,
			},
		);
	}

	return order.session.nexioPayInFullUrl!.url;
}
