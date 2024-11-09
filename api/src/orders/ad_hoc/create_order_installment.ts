import { getWebUrl } from '../../helpers/get_web_url';
import { BadRequest } from '../../infrastructure/common/errors';
import { getPersonalInfoFromWp } from '../../integrations/wordpress';
import { getProductFromId, ProductId } from '../../resources/products';
import { genUuid } from '../../utils/gen_uuid';
import { orderCollection, updateOrder } from '../collection';

export type CreateAdHocOrderInstallment = {
	email: string;
	productId: ProductId;
	amount: number;
};

export async function createAdHocOrderInstallment(request: CreateAdHocOrderInstallment) {
	const { email, productId, amount } = request;

	const product = getProductFromId(productId);
	if (!product) {
		throw new BadRequest('Product not found');
	}

	const order = await orderCollection.findOne(
		{
			'personalInfo.user.email': { $regex: new RegExp(`^${email}$`, 'i') },
		},
		{
			sort: {
				createdAt: -1,
			},
		},
	);

	if (
		order &&
		order.products.find((product) => product.product.id === productId) &&
		order.status !== 'completed'
	) {
		const id = genUuid();
		order.installments.push({
			id,
			status: 'pending',
			amount,
			payInFull: false,
			products: [
				{
					amount,
					id: productId,
					quantity: 1,
					isUpgrade: false,
					trinityCommissions: [],
				},
			],
		});
		await updateOrder(order._id.toString(), order, {
			...request,
			action: 'create_ad_hoc_order_installment',
		});
		return getWebUrl({
			path: '/installment',
			orderId: order._id.toString(),
			installmentId: id,
		});
	}

	const personalInfo = await getPersonalInfoFromWp(email);

	const id = genUuid();
	const { insertedId } = await orderCollection.insertOne({
		createdAt: new Date(),
		status: 'pending',
		products: [
			{
				product,
				status: 'active',
			},
		],
		personalInfo,
		type: 'ad_hoc',
		logs: [
			{
				date: new Date(),
				...request,
				action: 'create_ad_hoc_order_installment',
			},
		],
		installments: [
			{
				id,
				status: 'pending',
				amount,
				payInFull: false,
				products: [
					{
						amount,
						id: productId,
						quantity: 1,
						isUpgrade: false,
						trinityCommissions: [],
					},
				],
			},
		],
		session: {},
	});
	return getWebUrl({
		path: '/installment',
		orderId: insertedId.toString(),
		installmentId: id,
	});
}
