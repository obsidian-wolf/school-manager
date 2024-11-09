import { Post, Route, Tags, Body, Security } from 'tsoa';

import { logWebhookRequest } from '../integrations/prescribery/webhook';
import {
	getReassessmentCheckoutUrl,
	PrescriberyReassessmentPaymentRequest,
} from '../orders/default/reassessment/prescribery/reassessment';
import { logger } from '../utils/logger';

@Route('prescribery')
@Tags('Prescribery')
export class PrescriberyController {
	@Post('/webhook')
	@Security('jwt', ['prescribery'])
	public async webhook(@Body() requestBody: Record<string, any>) {
		return await logWebhookRequest(requestBody);
	}

	@Post('/pay')
	@Security('jwt', ['prescribery'])
	public async getReassessmentCheckoutUrl(
		@Body() requestBody: PrescriberyReassessmentPaymentRequest,
	) {
		logger.info({ message: 'Processing reassessment payment request', requestBody });
		return await getReassessmentCheckoutUrl(requestBody);
	}
}
