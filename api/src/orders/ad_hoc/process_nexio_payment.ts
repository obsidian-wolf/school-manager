import { getOrder, updateOrder } from '../collection';
import { BadRequest } from '../../infrastructure/common/errors';
import { getWebUrl } from '../../helpers/get_web_url';

export type ProcessOrderInstallment = {
	orderId: string;
	nexioPaymentId: string;
	installmentId: string;
};

export async function processAdHocNexioPayment(request: ProcessOrderInstallment): Promise<string> {
	const { orderId, nexioPaymentId, installmentId } = request;
	const order = await getOrder(orderId);

	const installment = order.installments.find((installment) => installment.id === installmentId);
	if (!installment) {
		throw new BadRequest('Installment not found');
	}

	if (installment.status !== 'pending') {
		throw new BadRequest('Installment already processed');
	}

	installment.status = 'paid';
	installment.payment = {
		type: 'nexio',
		paymentId: nexioPaymentId,
		date: new Date(),
	};
	installment.session = {};

	order.session = {};
	order.status = 'active';

	await updateOrder(orderId, order, {
		...request,
		action: 'process_order_installment',
	});

	return getWebUrl({ path: '/success', type: 'nexio', orderId });
}
