import { Route, Tags, Post, Security, Path } from 'tsoa';

import { cancelOrder } from '../orders/cancel_order';

@Route('order')
@Tags('Order')
export class OrderController {
	@Post('/cancel/{orderId}')
	@Security('jwt')
	public async cancelOrder(@Path() orderId: string) {
		return cancelOrder(orderId);
	}
}
