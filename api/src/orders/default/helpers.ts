import { getPayInFullProductPrice, getPayOverTimeProductPrice } from '../../resources/products';
import { Order } from '../types';

export function getPayInFullOrderPrice(order: Order) {
	return order.products.reduce((total, orderProduct) => {
		if (orderProduct.status !== 'active') {
			return total;
		}
		const productAmount = getPayInFullProductPrice(orderProduct.product);

		return total + (productAmount || 0);
	}, 0);
}

export function getPayOverTimeOrderPrice(order: Order, month: number) {
	return order.products.reduce((total, orderProduct) => {
		if (orderProduct.status !== 'active') {
			return total;
		}

		return total + getPayOverTimeProductPrice(orderProduct.product, month);
	}, 0);
}
