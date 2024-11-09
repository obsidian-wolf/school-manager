import { PrescriberyMedication } from '.';
import { getWebUrl } from '../../../../helpers/get_web_url';
import { BadRequest } from '../../../../infrastructure/common/errors';
import { orderCollection } from '../../../collection';
import { getProductFromPrescriberyReassessmentMedication } from './reassessment';

export type CreateOrderFromExistingReassessment = {
	email: string;
	medication: PrescriberyMedication;
};

export async function recreateReassessment(request: CreateOrderFromExistingReassessment) {
	const { email, medication } = request;
	const existingOrder = await orderCollection.findOne(
		{
			'personalInfo.user.email': email,
			status: {
				$in: ['voided', 'cancelled'],
			},
			type: 'reassessment',
		},
		{
			sort: {
				createdAt: -1,
			},
		},
	);
	if (!existingOrder || existingOrder.type !== 'reassessment') {
		throw new BadRequest('Order not found');
	}

	const product = getProductFromPrescriberyReassessmentMedication(medication);

	if (!product) {
		throw new BadRequest('Invalid medication');
	}

	const { insertedId } = await orderCollection.insertOne({
		createdAt: new Date(),
		status: 'pending',
		products: [
			{
				product,
				status: 'active',
			},
		],
		personalInfo: existingOrder.personalInfo,
		logs: [
			{
				date: new Date(),
				action: 'create_order_from_existing_reassessment',
				...request,
			},
		],
		prescribery: existingOrder.prescribery,
		type: 'reassessment',
		installments: [],
		session: {},
	});

	return getWebUrl({
		path: '/',
		orderId: insertedId.toString(),
	});
}
