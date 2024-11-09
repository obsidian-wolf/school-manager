import { Post, Route, Tags, Body, Security } from 'tsoa';
import { createQuestionnaire } from '../orders/default/first_time/questionnaire/create_questionnaire';
import { createOrderFromQuestionnaires } from '../orders/default/first_time/questionnaire/create_order_from_questionnaires';
import { QuestionnaireRequest } from '../orders/default/first_time/questionnaire/collection';

@Route('user')
@Tags('User')
export class UserController {
	@Post('/questionnaire')
	@Security('jwt', ['admin'])
	public async createQuestionnaire(@Body() requestBody: QuestionnaireRequest) {
		return await createQuestionnaire(requestBody);
	}

	@Post('/questionnaire/pay')
	@Security('jwt', ['admin'])
	public async getQuestionnairePaymentUrl(
		@Body() requestBody: { entry: string; forceCreate?: boolean },
	) {
		return await createOrderFromQuestionnaires(requestBody.entry, requestBody.forceCreate);
	}
}
