import { getTransactions, Transaction } from '../integrations/nexio/get_transactions';
import { orderCollection, updateOrder } from './collection';

export async function syncVoidedNexio() {
	const cancelledTransactions: Transaction[] = [];
	try {
		let offset = 0;
		const limit = 100;
		while (true) {
			const r = await getTransactions({
				limit,
				offset,
				transactionStatus: [30, 32, 39, 40, 50],
			});
			if (r.rows && r.rows.length) {
				cancelledTransactions.push(...r.rows);
			}
			if (r.hasMore) {
				offset = r.offset + r.limit;
			} else {
				break;
			}
		}

		// const res = await squareClient.paymentsApi.getPayment('pcu3blssnzfM6TT750zbJhIlvOFZY');

		// const  all.map((p) => ({
		// 	id: p.id,
		// 	refunded: !!p.refundedMoney,
		// }));

		// const refunded = all.filter((p) => !!p.refundedMoney);

		const cancelledTransactionIds = cancelledTransactions.map((p) => p.id!);

		const orders = await orderCollection
			.find({
				$and: [
					{
						'installments.payment.type': 'nexio',
					},
					{
						'installments.payment.transaction.id': { $in: cancelledTransactionIds },
					},
					{
						'installments.status': {
							$in: ['pending', 'paid'],
						},
					},
				],
			})
			.toArray();

		for (const order of orders) {
			const affectedProductIds: string[] = [];
			for (const installment of order.installments) {
				if (
					installment.payment?.type !== 'nexio' ||
					!installment.payment?.paymentDetails?.id
				) {
					continue;
				}
				if (cancelledTransactionIds.includes(installment.payment.paymentDetails.id)) {
					if (installment.status === 'paid') {
						installment.status = 'refunded';
					} else {
						installment.status = 'voided';
					}

					affectedProductIds.push(...installment.products.map((p) => p.id));
				}
			}
			if (affectedProductIds.length) {
				for (const product of order.products) {
					if (affectedProductIds.includes(product.product.id)) {
						if (product.status === 'completed') {
							product.status = 'active';
						}
					}
				}
				order.status = 'active';
			}
			await updateOrder(order._id.toString(), order, {
				action: 'sync_voided_nexio',
				affectedProductIds,
				cancelledTransactionIds,
			});
		}

		return cancelledTransactionIds;
	} catch (err) {
		console.log(err);
	}
}
