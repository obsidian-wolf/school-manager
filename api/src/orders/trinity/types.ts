import { SaveOrderExtendedResponse } from '../../integrations/trinity/save_order_extended_with_options';
import { VoidOrderResponse } from '../../integrations/trinity/void_order';
import { ProductPricing } from '../../resources/products';

export type TrinityProduct =
	| 'Product 1'
	| 'Product 2'
	| 'Product 3'
	| 'Product 4'
	| 'Product 5'
	| 'Product 6'
	| 'Product 7'
	| 'Product 9'
	| 'Product 10'
	| 'Product 11'
	| 'Product 12'
	| 'Product 13'
	| 'Product 14'
	| 'Product 15'
	| 'Product 16'
	| 'Product 17'
	| 'Product 18'
	| 'Product 20'
	| 'Product 22'
	| 'Product 23'
	| 'Product 24';

export type TrinityCommission = {
	dueDate: Date;

	month: number;

	dealer?: {
		date: Date;
		error?: any;
		success?: any;
	};

	trinityProduct?: TrinityProduct;

	saveOrder?: {
		date: Date;
		error?: any;
		success?: SaveOrderExtendedResponse;
	};

	voidOrder?: {
		date: Date;
		error?: any;
		success?: VoidOrderResponse;
	};

	productPricing?: ProductPricing;
};
