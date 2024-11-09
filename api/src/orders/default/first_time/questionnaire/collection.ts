import db from '../../../../infrastructure/db';

export type QuestionnaireRequest = {
	email: string;
	product: string;
	entry: string;
	id_document?: string;
	answers: Record<string, string>[];
};

export type Questionnaire = QuestionnaireRequest & {
	createdAt: Date;
};

export const questionnaireCollection = db.collection<Questionnaire>('questionnaire');
