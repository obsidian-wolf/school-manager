import { PrescriberyReassessmentPaymentRequest } from './reassessment';

export type PrescriberyReassessment = {
	request: PrescriberyReassessmentPaymentRequest;
	successResponse?: any;
	errorResponse?: any;
};
