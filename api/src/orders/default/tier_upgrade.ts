import { BadRequest } from '../../infrastructure/common/errors';
import { getProductFromName, Product } from '../../resources/products';
import { orderCollection } from '../collection';
import { upgradeOrderProduct } from './upgrade_order_product';

export type ReassessmentToMedication =
	| 'Semaglutide_Tier_2'
	| 'Semaglutide_Tier_3'
	| 'Semaglutide_Sublingual_Tier_2'
	| 'Semaglutide_Sublingual_Tier_3'
	| 'Tirzepatide_Tier_2'
	| 'Tirzepatide_Tier_3';

export type ReassessmentFromMedication =
	| 'Semaglutide_Tier_1'
	| 'Semaglutide_Tier_2'
	| 'Semaglutide_Tier_3'
	| 'Semaglutide_Sublingual_Tier_1'
	| 'Semaglutide_Sublingual_Tier_2'
	| 'Semaglutide_Sublingual_Tier_3'
	| 'Tirzepatide_Tier_1'
	| 'Tirzepatide_Tier_2'
	| 'Tirzepatide_Tier_3';

export function getProduct(medication: ReassessmentFromMedication) {
	const product = (() => {
		if (medication === 'Semaglutide_Tier_1') {
			return getProductFromName('Semaglutide', 1);
		}
		if (medication === 'Semaglutide_Tier_2') {
			return getProductFromName('Semaglutide', 2);
		}
		if (medication === 'Semaglutide_Tier_3') {
			return getProductFromName('Semaglutide', 3);
		}
		if (medication === 'Semaglutide_Sublingual_Tier_1') {
			return getProductFromName('Semaglutide Sublingual Drops', 1);
		}
		if (medication === 'Semaglutide_Sublingual_Tier_2') {
			return getProductFromName('Semaglutide Sublingual Drops', 2);
		}
		if (medication === 'Semaglutide_Sublingual_Tier_3') {
			return getProductFromName('Semaglutide Sublingual Drops', 3);
		}
		if (medication === 'Tirzepatide_Tier_1') {
			return getProductFromName('Tirzepatide', 1);
		}
		if (medication === 'Tirzepatide_Tier_2') {
			return getProductFromName('Tirzepatide', 2);
		}
		if (medication === 'Tirzepatide_Tier_3') {
			return getProductFromName('Tirzepatide', 3);
		}
	})();
	if (!product) {
		throw new BadRequest('Invalid medication');
	}
	return product;
}

export async function upgradeOrder(email: string, productFrom: Product, productTo: Product) {
	const orders = await orderCollection
		.find(
			{
				'personalInfo.user.email': email,
				status: {
					$in: ['active', 'completed'],
				},
			},
			{
				sort: {
					createdAt: -1,
				},
			},
		)
		.toArray();

	const order = orders.find((o) => {
		return o.products.some((p) => p.product.id === productFrom.id);
	});

	if (!order) {
		throw new BadRequest('Order not found');
	}

	return await upgradeOrderProduct({
		orderId: order._id.toString(),
		originalProductId: productFrom.id,
		upgradedProductId: productTo.id,
	});

	// TODO: maybe we don't need this at all.
	// return getWebUrl({
	// 	path: '/', { orderId: order._id.toString(), productId: productTo.id });
}
