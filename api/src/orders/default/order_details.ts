import { BadRequest } from '../../infrastructure/common/errors';
import { PersonalInfo } from '../../resources/personal_info';
import { Product } from '../../resources/products';
import { times } from '../../utils/times';
import { getOrder } from '../collection';
import { getPayInFullOrderPrice, getPayOverTimeOrderPrice } from './helpers';

export type OrderDetails = PersonalInfo & {
	products: Product[];
	fullPrice: number;
	payOverTimePlan: number[];
};

export async function getOrderDetails(orderId: string): Promise<OrderDetails> {
	const order = await getOrder(orderId);

	if (order.status !== 'pending') {
		throw new BadRequest('Order already processed');
	}

	const maxInstallmentIndex = order.products.reduce((max, item) => {
		return Math.max(max, item.product.payOverTimePlan?.length || 0);
	}, 0);

	return {
		...order.personalInfo,
		fullPrice: getPayInFullOrderPrice(order),
		payOverTimePlan: times(maxInstallmentIndex, (index) =>
			getPayOverTimeOrderPrice(order, index),
		),
		products: order.products
			.filter((p) => p.status === 'active')
			.map((orderProduct) => orderProduct.product),
	};
}
