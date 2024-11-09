import { BadRequest } from '../infrastructure/common/errors';
import { getOrder, updateOrder } from './collection';

export async function cancelOrder(orderId: string) {
	const order = await getOrder(orderId);

	if (order.status === 'voided') {
		throw new BadRequest('Order already voided');
	}
	if (order.status === 'cancelled') {
		throw new BadRequest('Order already cancelled');
	}
	if (order.status === 'pending') {
		order.status = 'voided';
		return await updateOrder(orderId, order, {
			action: 'cancel_order',
			reason: 'voided',
		});
	}

	// active or completed
	order.status = 'cancelled';

	order.products.forEach((productOrder) => {
		if (
			productOrder.status === 'voided' ||
			productOrder.status === 'cancelled' ||
			productOrder.status === 'upgraded'
		) {
			return;
		}

		const hasAnyPayments = order.installments.some(
			(installment) =>
				installment.status === 'paid' &&
				installment.products.some((product) => product.id === productOrder.product.id),
		);

		if (!hasAnyPayments) {
			productOrder.status = 'voided';
		} else {
			// active or completed
			productOrder.status = 'cancelled';
		}
	});

	order.installments.forEach((installment) => {
		if (installment.status === 'paid') {
			// TODO: refund payment
			installment.status = 'refunded';
		}
		if (installment.status === 'pending') {
			installment.status = 'voided';
		}

		// TODO: refund trinity commissions
	});

	await updateOrder(orderId, order, {
		action: 'cancel_order',
		// TODO: set reason,
	});
}
