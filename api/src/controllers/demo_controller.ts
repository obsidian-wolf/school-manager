import { Route, Tags, Get, Query, Hidden } from 'tsoa';
import {
	getReassessmentCheckoutUrl,
	PrescriberyReassessmentMedication,
	PrescriberyReassessmentPaymentRequest,
} from '../orders/default/reassessment/prescribery/reassessment';
import { createQuestionnaire } from '../orders/default/first_time/questionnaire/create_questionnaire';
import { createOrderFromQuestionnaires } from '../orders/default/first_time/questionnaire/create_order_from_questionnaires';
// import { dealerSearch } from '../integrations/trinity/dealer_search';

@Route('demo')
@Tags('Demo')
@Hidden()
export class DemoController {
	@Get('/generate-questionnaire')
	public async generateQuestionnaire() {
		return await createQuestionnaire({
			email: 'newtest123@gmail.com',
			product: 'MTY1',
			entry: '11985',
			answers: [
				{
					notes: 'What is your height?',
					height: '5\'10"',
				},
				{
					notes: 'What is your current weight (in lbs)',
					current_weight: '180',
				},
				{
					notes: 'What is your goal weight (in lbs)?',
					goal_weight: '120',
				},
				{
					notes: 'What is your goal weight (in lbs)?',
					goal_weight: '120',
				},
				{
					notes: 'Do you have any known allergies to B12 or cobalt?',
					b12: 'No',
				},
				{
					notes: 'Have you experienced any allergic reactions to medications or preservatives in the past?',
					lapses: 'No',
				},
				{
					notes: 'If yes, please tell us why you took a break from treatment?',
					allergic_reactions: '',
				},
				{
					notes: "Have you been diagnosed with Leber's hereditary optic neuropathy?",
					leber_hereditary: 'No',
				},
				{
					notes: 'If yes, please describe',
					leber_hereditary2: '',
				},
				{
					notes: 'Do you have Polycythemia Vera or any other conditions that affect the red blood cell levels?',
					leber_hereditary2: 'No',
				},
				{
					notes: 'Do you have any current infections, skin conditions, or rashes at potential injection sites?',
					current_infections: 'No',
				},
				{
					notes: 'Have you been diagnosed with any severe liver diseases?',
					liver_diseases: 'No',
				},
				{
					notes: 'Please describe',
					surgical_history: '',
				},
				{
					notes: 'Have you been diagnosed with any liver or kidney disease?',
					kidney_diseases: '',
				},
				{
					notes: 'Please describe',
					surgical_history: '',
				},
				{
					notes: 'Are you currently pregnant, any chance that you may be pregnant, or breastfeeding?',
					pregnant: 'No',
				},
				{
					notes: 'Do you have any other conditions or are you taking any other medications that may impact your suitability for vitamin B12 injections?',
					pregnant: 'No',
				},
				{
					notes: 'Please describe',
					pregnant: '',
				},
				{
					notes: 'Have you had a physical in the last 3 years?',
					entry_id: 'Yes',
				},
				{
					notes: 'Have you had lab work done in the last 3 years?',
					entry_id: 'Yes',
				},
				{
					notes: 'If you had lab work in the past three years, please enter the month and year.',
					entry_id: '10/09/2024',
				},
				{
					notes: 'Do you currently take any medications? If so, which ones?',
					entry_id: 'No',
				},
				{
					notes: 'Do you have any known allergies, including medications?',
					entry_id: 'No',
				},
				{
					notes: 'Do you have any current diagnosed medical conditions?',
					entry_id: '',
				},
				{
					notes: 'Please list any other information that you would like to share with our provider:',
					entry_id: 'none',
				},
				{
					notes: 'At Ellie, we adore our brand partners and entrepreneurs! Please enter the name of the brand partner who referred you. If you are a brand partner, please enter your own name. If you found Ellie without a brand partner, tell us how?',
					entry_id: 'Adrienne Bovan, FL',
				},
			],
		});
	}

	@Get('/generate-questionnaire-pay-url')
	public async generateQuestionnairePayUrl() {
		return await createOrderFromQuestionnaires('11985');
	}

	@Get('/generate-reassessment')
	public async generateReassessment(
		@Query() email: string = 'louischarlesblok7777@gmail.com',
		@Query()
		medication: PrescriberyReassessmentMedication = 'Semaglutide_Tier_1_Increase_my_dose',
	) {
		const request: PrescriberyReassessmentPaymentRequest = {
			first_name: 'CJ',
			last_name: 'Visser',
			email,
			dob: '1990-01-01',
			gender: 'Male',
			// lead_id?: number;
			// assessment_id?: number;
			assessment_token: 'TEST',
			redirect_url: 'https://elliemd.com',
			// patient_id?: string;
			// isSyncUpgrade?: boolean;
			plan: {
				// amount?: string;
				medication,
			},
		};

		return await getReassessmentCheckoutUrl(request);
	}

	@Get('/temp')
	public async temp() {
		// return await dealerSearch({
		// 	PrimaryEmail: 'cuff22@comcast.net',
		// });
		// return await fixOldPayments();
		return true;
	}
}
