import { differenceInMinutes } from 'date-fns';

import { BadRequest } from '../../infrastructure/common/errors';
import { getNexioUrl } from '../../integrations/nexio/get_token';
import { getOrder, updateOrder } from '../collection';
import { getRunCardTransactionPayload } from '../../integrations/nexio/get_run_card_transaction';
import { getProductFromId } from '../../resources/products';

export async function getNexioAdHocPaymentUrl(
	orderId: string,
	installmentId: string,
	{ reset }: { reset: boolean } = { reset: false },
) {
	const order = await getOrder(orderId);

	const installment = order.installments.find((installment) => installment.id === installmentId);
	if (!installment) {
		throw new BadRequest('Installment not found');
	}

	let { nexioUrl } = installment.session || {};

	if (reset || !nexioUrl || differenceInMinutes(new Date(nexioUrl.expiration), new Date()) < 10) {
		nexioUrl = await getNexioUrl(
			getRunCardTransactionPayload({
				orderNumber: installment.id,
				amount: installment.amount,
				personalInfo: order.personalInfo,
				isInitialPayment: true,
				items: installment.products.map((installmentProduct) => ({
					item: getProductFromId(installmentProduct.id)?.name || '',
					// description: string;
					quantity: 1,
					price: installmentProduct.amount,
					type: 'sale',
				})),
			}),
		);

		if (!installment.session) {
			installment.session = {};
		}

		installment.session.nexioUrl = nexioUrl;
		await updateOrder(orderId, order, {
			action: 'set_nexio_url',
			installmentId,
			nexioUrl,
		});
	}
	return installment.session!.nexioUrl!.url;
}
