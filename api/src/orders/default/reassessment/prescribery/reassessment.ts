import { z } from 'zod';
import { PrescriberyPaymentRequest } from '.';
import { BadRequest } from '../../../../infrastructure/common/errors';
import { getProductFromName } from '../../../../resources/products';
import { orderCollection } from '../../../collection';
import { getPersonalInfo } from './get_personal_info';
import { getWebUrl } from '../../../../helpers/get_web_url';

export const PRESCRIBERY_REASSESSMENT_MEDICATIONS = [
	'Semaglutide_Tier_1_Increase_my_dose',
	'Semaglutide_Tier_1_Stay_on_my_current_dose',
	'Semaglutide_Tier_1_Switch_to_Tirzepatide',
	'Semaglutide_Tier_2_Increase_my_dose',
	'Semaglutide_Tier_2_Stay_on_my_current_dose',
	'Semaglutide_Tier_2_Decrease_my_dose',
	'Semaglutide_Tier_2_Switch_to_Tirzepatide',
	'Semaglutide_Tier_3_Stay_on_my_current_dose',
	'Semaglutide_Tier_3_Decrease_my_dose',
	'Semaglutide_Tier_3_Switch_to_Tirzepatide',
	'Tirzepatide_Tier_1_Increase_my_dose',
	'Tirzepatide_Tier_1_Stay_on_my_current_dose',
	'Tirzepatide_Tier_1_Switch_to_Semaglutide',
	'Tirzepatide_Tier_2_Increase_my_dose',
	'Tirzepatide_Tier_2_Stay_on_my_current_dose',
	'Tirzepatide_Tier_2_Decrease_my_dose',
	'Tirzepatide_Tier_2_Switch_to_Semaglutide',
	'Tirzepatide_Tier_3_Stay_on_my_current_dose',
	'Tirzepatide_Tier_3_Decrease_my_dose',
	'Tirzepatide_Tier_3_Switch_to_Semaglutide',
] as const;

export type PrescriberyReassessmentMedication =
	(typeof PRESCRIBERY_REASSESSMENT_MEDICATIONS)[number];

export function getProductFromPrescriberyReassessmentMedication(
	prescriberyMedication: PrescriberyReassessmentMedication,
) {
	const [_name, , _tier, change] = prescriberyMedication.split('_');
	const productName =
		change === 'Switch' ? (_name === 'Semaglutide' ? 'Tirzepatide' : 'Semaglutide') : _name;

	let tier = parseInt(_tier);
	if (change === 'Decrease') {
		tier -= 1;
	}
	if (change === 'Increase') {
		tier += 1;
	}
	return getProductFromName(productName, tier);
}

export type PrescriberyReassessmentPaymentRequest = Omit<
	PrescriberyPaymentRequest,
	'assessment_token' | 'plan' | 'billing' | 'shipping'
> & {
	plan: {
		amount?: string;
		medication: PrescriberyReassessmentMedication;
	};
	assessment_token: string;
};

export const PrescriberyReassessmentPaymentRequestSchema = z.object({
	email: z.string().email(),
	dob: z.string().refine(
		(dob) => {
			const date = new Date(dob);
			return !isNaN(date.getTime());
		},
		{ message: 'Invalid date of birth' },
	),
	assessment_token: z.string().min(1, { message: 'Invalid assessment token' }),
	redirect_url: z.string().url(),
	plan: z.object({
		medication: z.enum(PRESCRIBERY_REASSESSMENT_MEDICATIONS),
	}),
});

export async function getReassessmentCheckoutUrl(
	reassessmentRequest: PrescriberyReassessmentPaymentRequest,
) {
	const validation = PrescriberyReassessmentPaymentRequestSchema.safeParse(reassessmentRequest);
	if (!validation.success) {
		throw new BadRequest('Validation error', validation.error);
	}

	const product = getProductFromPrescriberyReassessmentMedication(
		reassessmentRequest.plan.medication,
	);

	if (!product) {
		throw new BadRequest('Invalid medication');
	}

	const personalInfo = await getPersonalInfo(reassessmentRequest);

	const orderId = await orderCollection.insertOne({
		createdAt: new Date(),
		status: 'pending',
		products: [
			{
				product,
				status: 'active',
			},
		],
		prescribery: { request: reassessmentRequest },
		type: 'reassessment',
		personalInfo,
		logs: [
			{
				date: new Date(),
				action: 'create_order_from_reassessment_request',
				reassessmentRequest,
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
