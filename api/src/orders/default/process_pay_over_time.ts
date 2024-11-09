import { isBefore } from 'date-fns';
import { orderCollection, updateOrder } from '../collection';
import { ProcessCard, processCard } from '../../integrations/nexio/process_card';
import { getRunCardTransactionPayload } from '../../integrations/nexio/get_run_card_transaction';
import { getPayOverTimeOrderPrice } from './helpers';
import { genUuid } from '../../utils/gen_uuid';
import { getPayOverTimeProductPrice } from '../../resources/products';
import { getCardTokenFromNexioInstallments } from './upgrade_order_product';
import { parseError } from '../../utils/axios';

export type ProcessOverTimePayment = {
	amount: number;
	month: number;
	date: Date;
};

export async function processPayOverTime() {
	let orders = await orderCollection
		.find({
			status: 'active',
		})
		.toArray();

	orders = orders.filter((o) => {
		return o.installments.find(
			(i) =>
				i.payment?.type === 'nexio' &&
				!i.payInFull &&
				i.status === 'pending' &&
				i.dueDate &&
				isBefore(i.dueDate, new Date()),
		);
	});

	for (const order of orders) {
		let hasChanged = false;

		const cardToken = await getCardTokenFromNexioInstallments(order);

		let month = 0;
		for (const installment of order.installments) {
			if (installment.payment?.type === 'afterpay' || installment.payInFull) {
				continue;
			}
			if (installment.status !== 'pending') {
				if (installment.status === 'paid') {
					month += 1;
				}
				continue;
			}
			if (installment.dueDate && isBefore(installment.dueDate, new Date())) {
				hasChanged = true;

				if (!installment.id) {
					installment.id = genUuid();
				}

				const payload: ProcessCard = {
					...getRunCardTransactionPayload({
						orderNumber: installment.id,
						amount: getPayOverTimeOrderPrice(order, month),
						personalInfo: order.personalInfo,
						isInitialPayment: false,
						items: order.products.map((orderProduct) => ({
							item: orderProduct.product.name,
							// description: string;
							quantity: 1,
							price: getPayOverTimeProductPrice(orderProduct.product, month),
							type: 'sale',
						})),
					}),
					tokenex: {
						token: cardToken.token,
					},
				};

				if (!installment.payment) {
					installment.payment = {
						date: new Date(),
						type: 'nexio',
					};
				}

				try {
					const processCardResponse = await processCard(payload);
					installment.payment.processCardResponse = processCardResponse;
				} catch (e) {
					installment.payment.error = parseError(e);
				}
			}
		}

		if (hasChanged) {
			await updateOrder(order._id.toString(), order, {
				action: 'process_over_time_payment',
				date: new Date(),
				amount: getPayOverTimeOrderPrice(order, month),
				month,
			});
		}
	}
}
