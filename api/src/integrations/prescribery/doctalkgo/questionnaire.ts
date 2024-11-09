import { BadRequest } from '../../../infrastructure/common/errors';
import { prescriberyFetch } from './api';

export type QuestionnaireAnswerRequest = {
	template_id: string;
	patient_id: string;
	// ques_map_id: string;
	is_submitted: boolean;
	answers: {
		entry_id: string;
		answer?: string;
		multiple_answers?: {
			answer: string;
		}[];
	}[];
};

type AnswerQuestionnaireResponse = {
	code: number;
	message: string;
	questionnaire_details?: {
		ques_map_id: number;
	};
};

export async function answerQuestionnaire(request: QuestionnaireAnswerRequest) {
	/** TODO: why is callApi not working? */
	const response = await prescriberyFetch<AnswerQuestionnaireResponse>(`/questionnaire/answers`, {
		method: 'POST',
		body: JSON.stringify(request),
	});
	if (!response.questionnaire_details) {
		throw new BadRequest(JSON.stringify(response));
	}
	return response.questionnaire_details;
}

export async function TEST_answerQuestionnaire() {
	const request: QuestionnaireAnswerRequest = {
		template_id: '650',
		patient_id: '3958',
		is_submitted: true,
		answers: [
			{
				entry_id: '193',
				answer: 'N/A',
			},
			{
				entry_id: '5002',
				answer: "6'1",
			},
			{
				entry_id: 'number-1716065742030',
				answer: '203',
			},
			{
				entry_id: 'number-1716066000281',
				answer: '190',
			},
			{
				entry_id: 'radio-group-1717115046532',
				answer: 'No',
			},
			{
				entry_id: '194',
				multiple_answers: [
					{
						answer: 'None of the above',
					},
				],
			},
			{
				entry_id: 'checkbox-group-1683235363988',
				multiple_answers: [
					{
						answer: 'None of the above',
					},
				],
			},
			{
				entry_id: '4797',
				multiple_answers: [
					{
						answer: 'None of the above',
					},
				],
			},
			{
				entry_id: '5847',
				answer: 'Yes',
			},
			{
				entry_id: '5848',
				answer: 'August 2023',
			},
			{
				entry_id: '5849',
				answer: 'No',
			},
		],
	};

	try {
		const response = await answerQuestionnaire(request);
		console.log(response);
		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

/**
 * {
  "code": 0,
  "message": "Questionnaire saved successfully",
  "questionnaire_details": {
    "ques_map_id": 19754
  }
}
 */

/**
 File upload:
 {
  "code": 0,
  "message": "Document uploaded successfully",
  "patient_document": {
    "document_id": 2551,
    "document_file": "https://s3.us-east-2.amazonaws.com/stagingdtg/patient_document/image1727193576.jpg",
    "title": "Prescription"
  }
}
 */
