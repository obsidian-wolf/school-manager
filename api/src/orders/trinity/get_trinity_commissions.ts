import { addMonths } from 'date-fns';
import { Product } from '../../resources/products';
import { times } from '../../utils/times';
import { TrinityCommission } from './types';

export function getPayInFullTrinityCommissions(product: Product): TrinityCommission[] {
	return times(product.monthSupply, (month) => ({
		dueDate: addMonths(new Date(), month),
		month,
	}));
}
