import { format } from 'date-fns';
import { getPatient, Patient } from '../../../../integrations/prescribery/doctalkgo/get_patient';
import { createPatient } from '../../../../integrations/prescribery/doctalkgo/create_patient';
import { US_STATES } from '../../../../resources/us_states';
import { getProductFromSku } from '../../../../resources/products';
import { BadRequest } from '../../../../infrastructure/common/errors';
import { answerQuestionnaire } from '../../../../integrations/prescribery/doctalkgo/questionnaire';
import { mapQuestionnaire } from './questionnaires';
import { PersonalInfo } from '../../../../resources/personal_info';
import { createPatientDocument } from '../../../../integrations/prescribery/doctalkgo/patient_document';
import { questionnaireCollection } from '../questionnaire/collection';
import { PrescriberyFirstTime } from './types';

function extractHref(htmlString: string): string | undefined {
	const hrefMatch = htmlString.match(/href="([^"]*)"/);
	return hrefMatch ? hrefMatch[1] : undefined;
}

export async function processQuestionnaires(
	{ user, shipping }: PersonalInfo,
	prescribery: PrescriberyFirstTime,
): Promise<PrescriberyFirstTime> {
	const questionnaires = await questionnaireCollection
		.find({ entry: prescribery.entry })
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
		return { product, questionnaire };
	});

	// create or get patient
	let patient: Patient | undefined;

	try {
		patient = await getPatient(user.email, user.dob!);

		if (!patient?.id) {
			throw new BadRequest('Existing patient does not have an id');
		}
	} catch {
		patient = await createPatient({
			first_name: user.firstName,
			// middle_name: user.middleName,
			last_name: user.lastName,
			email: user.email,
			dob: format(user.dob!, 'yyyy-MM-dd'),
			gender: user.gender,
			postal_code: shipping.postcode,
			// replace all non numbers
			mobile: user.phone!.replace(/\D/g, ''),
			// create_contact_on?: string[]; // Assuming it's an array of strings
			city: shipping.city,
			state: US_STATES.find((u) => u.value === shipping.stateCode)?.label,
			address_line1: shipping.address,
			welcome_email: false,
		});
	}

	const patientId = patient.id?.toString() || patient.patient_id?.toString();

	if (!patientId) {
		throw new BadRequest('Patient does not have an id');
	}

	const questionnaireIds: number[] = [];

	const idDocument = questionnaires.find((q) => q.id_document)?.id_document;
	if (idDocument) {
		const fileUrl = extractHref(idDocument) || idDocument;
		try {
			await createPatientDocument(patientId, fileUrl, 'id_document');
		} catch {
			//
		}
	}

	for (const { product, questionnaire } of products) {
		let mappedQuestionnaire = product.sku
			? await mapQuestionnaire(
					patientId,
					product.sku.toLocaleLowerCase() as any,
					questionnaire.answers,
				)
			: undefined;

		if (!mappedQuestionnaire) {
			mappedQuestionnaire = [];
		}

		const { ques_map_id } = await answerQuestionnaire({
			patient_id: patientId,
			template_id: product.prescriberyTemplate!,
			is_submitted: true,
			answers: mappedQuestionnaire,
		});
		questionnaireIds.push(ques_map_id);
	}

	return {
		...prescribery,
		questionnaireIds,
		patient,
	};
}
