import { BadRequest } from '../../../../infrastructure/common/errors';
import { getProductFromName } from '../../../../resources/products';
import { PrescriberyReassessmentMedication } from './reassessment';

export type PrescriberyMedication = PrescriberyReassessmentMedication;

export type PrescriberyPaymentRequest = {
	first_name: string;
	last_name: string;
	email: string;
	dob: string;
	gender: string;
	lead_id?: number;
	assessment_id?: number;
	assessment_token?: string;
	redirect_url: string;
	patient_id?: string;
	shipping?: {
		address_line1?: string;
		address_line2?: string;
		state?: string;
		postal_code?: string;
		city?: string;
	};
	billing?: {
		address_line1?: string;
		state?: string;
		postal_code?: string;
		city?: string;
	};
	plan: {
		amount?: string;
		medication: PrescriberyMedication;
	};
	isSyncUpgrade?: boolean;
};

export function getMedicationFromPrescriberyReassessmentMedication(
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
	const product = getProductFromName(productName, tier);
	if (!product) {
		throw new BadRequest('Medication not found');
	}
	return product;
}
