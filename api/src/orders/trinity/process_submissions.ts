import { WithId } from 'mongodb';
import { isAfter } from 'date-fns';
import { orderCollection, updateOrder } from '../collection';
import { parseError } from '../../utils/axios';
import { getDealer } from './get_dealer';
import { saveOrderExtendedWithOptions } from '../../integrations/trinity/save_order_extended_with_options';
import { TrinityCommission } from './types';
import { Order } from '../types';
import { getProductFromId, ProductId } from '../../resources/products';
import { getPersonalInfoFromWp } from '../../integrations/wordpress';
import { dealerSearch } from '../../integrations/trinity/dealer_search';

export async function processOrderSubmission(order: WithId<Order>, preview: boolean = true) {
	let hasChanges = false;
	if (order.status === 'pending' || order.status === 'voided') {
		return;
	}
	const voidedItems: any[] = [];
	const saveOrderItems: any[] = [];
	const updatedTrinityCommissions: TrinityCommission[] = [];
	const errorItems: any[] = [];

	for (const installment of order.installments) {
		if (installment.status !== 'paid') {
			continue;
		}
		for (const installmentProduct of installment.products) {
			const product = order.products.find(
				(p) => p.product.id === installmentProduct.id,
			)?.product;

			if (!product) {
				continue;
			}

			for (const trinityCommission of installmentProduct.trinityCommissions) {
				if (trinityCommission.saveOrder?.success) {
					continue;
				}
				if (isAfter(trinityCommission.dueDate, new Date())) {
					continue;
				}
				saveOrderItems.push({
					...trinityCommission,
					product: product.id,
				});
				if (preview) {
					continue;
				}
				if (!product.trinityId) {
					continue;
				}

				try {
					const dealer = (
						await dealerSearch({
							PrimaryEmail: order.personalInfo.user.email,
						})
					)?.[0];
					if (!dealer || !dealer.DealerID) {
						errorItems.push({
							type: 'dealer_not_found',
							email: order.personalInfo.user.email,
							...trinityCommission,
							product: product.id,
						});
						continue;
					}
					trinityCommission.dealer = {
						date: new Date(),
						success: dealer,
					};
				} catch {
					errorItems.push({
						type: 'dealer_not_found_2',
						email: order.personalInfo.user.email,
						...trinityCommission,
						product: product.id,
					});
					continue;
				}
				hasChanges = true;
				// trinityCommission.dealer = await getDealer(order.personalInfo.user.dealerId);
				if (trinityCommission.dealer?.success) {
					order.personalInfo.user.dealerId = Number(
						trinityCommission.dealer.success.DealerID,
					);

					updatedTrinityCommissions.push(trinityCommission);
					trinityCommission.saveOrder = {
						date: new Date(),
					};
					try {
						const res = await saveOrderExtendedWithOptions(
							order.personalInfo,
							trinityCommission.dealer.success,
							order.personalInfo.user.dealerId,
							trinityCommission.month,
							{
								retailPrice: product.retailPrice,
								wholesalePrice: product.wholesalePrice,
								psvAmount: product.psvAmount,
								uplineVolume: product.uplineVolume,
								trinityId: product.trinityId,
							},
						);
						trinityCommission.saveOrder.success = res;
					} catch (err) {
						trinityCommission.saveOrder.error = parseError(err);
					}
				} else {
					errorItems.push({
						type: 'save_order_error',
						email: order.personalInfo.user.email,
						...trinityCommission,
						product: product.id,
					});
				}
			}
		}
	}

	if (!preview && hasChanges) {
		await updateOrder(order._id.toString(), order, {
			action: 'process_order_submission',
			updatedTrinityCommissions,
		});
	}
	return { voidedItems, saveOrderItems, errorItems };
}

export async function processSubmissions(preview: boolean = true) {
	const allOrders = await orderCollection
		.find({
			status: {
				$nin: ['pending', 'voided'],
			},
		})
		.toArray();

	const result: Record<string, any> = {};

	for (const order of allOrders) {
		result[order.personalInfo.user.email] = await processOrderSubmission(order, preview);
	}

	if (preview) {
		const pretty: any[] = [];
		for (const [email, value] of Object.entries(result)) {
			if (!value.saveOrderItems.length) {
				continue;
			}
			for (const item of value.saveOrderItems) {
				pretty.push({
					email,
					product: item.product,
					dueData: item.dueDate,
					month: item.month + 1,
				});
			}
		}
		return pretty;
	}

	return result;
}

export async function processAdHocOrderSubmission(
	order: WithId<Order>,
	index: number,
	preview: boolean = true,
) {
	let hasChanges = false;
	if (order.status === 'pending' || order.status === 'voided') {
		return;
	}
	const voidedItems: any[] = [];
	const saveOrderItems: any[] = [];
	const updatedTrinityCommissions: TrinityCommission[] = [];

	for (const installment of order.installments) {
		if (installment.status !== 'paid') {
			continue;
		}
		for (const installmentProduct of installment.products) {
			const product = order.products.find(
				(p) => p.product.id === installmentProduct.id,
			)?.product;

			if (!product) {
				continue;
			}

			if (!installmentProduct.trinityCommissions[index]) {
				installmentProduct.trinityCommissions[index] = {
					dueDate: new Date(),
					month: index,
				};
			}

			for (const trinityCommission of installmentProduct.trinityCommissions) {
				if (trinityCommission.saveOrder?.success) {
					continue;
				}
				if (isAfter(trinityCommission.dueDate, new Date())) {
					continue;
				}
				if (preview) {
					saveOrderItems.push(trinityCommission);
					continue;
				}
				if (!product.trinityId) {
					continue;
				}
				hasChanges = true;

				trinityCommission.dealer = await getDealer(order.personalInfo.user.dealerId);
				if (trinityCommission.dealer?.success) {
					updatedTrinityCommissions.push(trinityCommission);
					trinityCommission.saveOrder = {
						date: new Date(),
					};
					try {
						const res = await saveOrderExtendedWithOptions(
							order.personalInfo,
							trinityCommission.dealer.success,
							order.personalInfo.user.dealerId,
							trinityCommission.month,
							{
								retailPrice: product.retailPrice,
								wholesalePrice: product.wholesalePrice,
								psvAmount: product.psvAmount,
								uplineVolume: product.uplineVolume,
								trinityId: product.trinityId,
							},
						);
						trinityCommission.saveOrder.success = res;
					} catch (err) {
						trinityCommission.saveOrder.error = parseError(err);
					}
				}
			}
		}
	}

	if (!preview && hasChanges) {
		await updateOrder(order._id.toString(), order, {
			action: 'process_order_submission',
			updatedTrinityCommissions,
		});
	}
	return { voidedItems, saveOrderItems };
}

export async function processAdHocSubmissions(preview: boolean = true) {
	const orders = {
		/*'awatson18@aol.com': 0*/ 'vcu98ram@yahoo.com': 0,
		'starrdupree@gmail.com': 0,
	};
	const allOrders = await orderCollection
		.find({
			'personalInfo.user.email': { $in: Object.keys(orders) },
		})
		.toArray();

	const result: Record<string, any> = {};

	for (const order of allOrders) {
		result[order.personalInfo.user.email] = await processAdHocOrderSubmission(
			order,
			orders[order.personalInfo.user.email as keyof typeof orders],
			preview,
		);
	}

	return result;
}

export async function processTrueAdHocSubmissions() {
	const orders: { dealer: number; product: ProductId; email: string; month: 0 }[] = [
		{ dealer: 822775, product: 'semaglutide_microdose', email: 'rstaceyk@aol.com', month: 0 },
		{
			dealer: 832782,
			product: 'semaglutide_microdose',
			email: 'samanthaboothby18@gmail.com',
			month: 0,
		},
		{
			dealer: 814475,
			product: 'pt_141_injection',
			email: 'coloradocoed@hotmail.com',
			month: 0,
		},
	];

	for (const order of orders) {
		const dealer = await getDealer(order.dealer);

		if (dealer?.success) {
			const personalInfo = await getPersonalInfoFromWp(order.email);

			const product = (await getProductFromId(order.product))!;
			try {
				const res = await saveOrderExtendedWithOptions(
					personalInfo,
					dealer.success,
					order.dealer,
					order.month,
					{
						retailPrice: product.retailPrice,
						wholesalePrice: product.wholesalePrice,
						psvAmount: product.psvAmount,
						uplineVolume: product.uplineVolume,
						trinityId: product.trinityId!,
					},
				);
				console.log(res);
				//
			} catch (err) {
				//
				console.log(err);
			}
		}
	}
}
