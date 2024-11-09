import { BadRequest } from '../../../../infrastructure/common/errors';
import { getProductFromSku } from '../../../../resources/products';
import { questionnaireCollection, QuestionnaireRequest } from './collection';

export async function createQuestionnaire(questionnaire: QuestionnaireRequest): Promise<string> {
	const product = getProductFromSku(questionnaire.product);

	if (!product) {
		throw new BadRequest('Invalid product');
	}

	const result = await questionnaireCollection.insertOne({
		...questionnaire,
		createdAt: new Date(),
	});

	return result.insertedId.toString();
}
