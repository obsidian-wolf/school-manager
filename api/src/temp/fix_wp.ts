import { dealerSearch } from '../integrations/trinity/dealer_search';
import { getWp } from '../integrations/wordpress';
import { orderCollection } from '../orders/collection';
import { getProductFromId } from '../resources/products';

export async function fixWP() {
	const orders = await orderCollection.find({}).toArray();

	const ordersToBeFixed = orders.filter(
		(o) => o.personalInfo.user.wp && !o.personalInfo.user.wp.user,
	);

	for (const order of ordersToBeFixed) {
		order.personalInfo.user.wp = await getWp(order.personalInfo.user.email);
		order.personalInfo.user.dealerId = Number(order.personalInfo.user.wp.user!.meta!.dealer_id);

		await orderCollection.updateOne({ _id: order._id }, { $set: order });
	}
}

export async function fixProduct() {
	const orders = await orderCollection.find({}).toArray();
	const all: any[] = [];
	for (const order of orders) {
		for (const product of order.products) {
			if (
				product.product.id === 'semaglutide_sublingual_tier_1' ||
				product.product.id === 'semaglutide_sublingual_tier_2' ||
				product.product.id === 'semaglutide_sublingual_tier_3'
			) {
				product.product = getProductFromId(product.product.id)!;

				await orderCollection.updateOne({ _id: order._id }, { $set: order });
			}
		}
	}

	console.log('done', all);
}

export async function a() {
	const orders = await orderCollection
		.find({
			$or: [
				{
					'personalInfo.user.dealerId': {
						$exists: false,
					},
				},
				{
					'personalInfo.user.dealerId': {
						$not: { $type: 'number' },
					},
				},
				{ 'personalInfo.user.dealerId': { $lte: 0 } },
			],
		})
		.toArray();

	try {
		for (const order of orders) {
			const d = await dealerSearch({ PrimaryEmail: order.personalInfo.user.email });
			const user = d && d[0];
			if (!user || !user.DealerID) {
				console.log(user);
				continue;
			}
			order.personalInfo.user.dealerId = Number(user.DealerID);

			await orderCollection.updateOne({ _id: order._id }, { $set: order });
		}
	} catch (err) {
		console.log(err);
	}
}
