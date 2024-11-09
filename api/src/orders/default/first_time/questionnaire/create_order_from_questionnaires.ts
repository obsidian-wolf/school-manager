import { getWebUrl } from '../../../../helpers/get_web_url';
import { BadRequest } from '../../../../infrastructure/common/errors';
import { getPersonalInfoFromWp } from '../../../../integrations/wordpress';
import { orderCollection } from '../../../collection';
import { questionnaireCollection } from './collection';
import { getProductFromSku } from '../../../../resources/products';

export async function createOrderFromQuestionnaires(
	entry: string,
	forceCreate = false,
): Promise<string> {
	const questionnaires = await questionnaireCollection
		.find({ entry })
		.sort('createdAt', -1)
		.toArray();

	if (questionnaires.length === 0) {
		throw new BadRequest('No Questionnaires found');
	}

	const products = questionnaires.map((questionnaire) => {
		const product = getProductFromSku(questionnaire.product);
		if (!product) {
			throw new BadRequest('Invalid product sku');
		}
		if (!product.prescriberyTemplate) {
			throw new BadRequest('Product does not have a prescribery template');
		}
		return product;
	});

	if (!forceCreate) {
		const existingOrder = await orderCollection.findOne({
			'prescribery.entry': entry,
			status: 'pending',
		});
		if (existingOrder) {
			const existingOrderProductIds = existingOrder.products.map((p) => p.product.id);
			const newOrderProductIds = products.map((p) => p.id);
			if (
				existingOrderProductIds.length === newOrderProductIds.length &&
				existingOrderProductIds.every((p) => newOrderProductIds.includes(p))
			) {
				return getWebUrl({
					path: '/',
					orderId: existingOrder._id.toString(),
				});
			}
		}
	}

	const email = questionnaires[0].email;

	const personalInfo = await getPersonalInfoFromWp(email);

	const orderId = await orderCollection.insertOne({
		createdAt: new Date(),
		status: 'pending',
		products: products.map((product) => {
			return {
				product,
				status: 'active',
			};
		}),
		prescribery: {
			entry,
		},
		type: 'first_time',
		personalInfo,
		logs: [
			{
				date: new Date(),
				entry,
				action: 'create_order_from_questionnaires',
			},
		],
		installments: [],
		session: {},
	});

	return getWebUrl({
		path: '/',
		orderId: orderId.insertedId.toString(),
	});
}
