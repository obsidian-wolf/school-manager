import { BadRequest } from '../../infrastructure/common/errors';
import { getOrder } from '../collection';
import { PersonalInfo } from '../../resources/personal_info';
import { getProductFromId, Product } from '../../resources/products';
import { Installment } from '../types';

export type OrderInstallmentDetails = PersonalInfo & {
	installmentIndex: number;
	product: Product;
	amount: number;
};

export async function getAdHocOrderInstallment(
	orderId: string,
	installmentId: string,
): Promise<OrderInstallmentDetails> {
	const order = await getOrder(orderId);

	let installmentIndex = 0;
	let installment: Installment | undefined;
	for (const i of order.installments) {
		if (i.id === installmentId) {
			installment = i;
			break;
		}
		if (i.status === 'paid') {
			installmentIndex += 1;
		}
	}

	if (!installment) {
		throw new BadRequest('Installment not found');
	}

	const product = getProductFromId(installment.products[0]!.id);

	if (!product) {
		throw new BadRequest('Product not found');
	}

	return {
		...order.personalInfo,
		amount: installment.amount,
		installmentIndex,
		product,
	};
}
