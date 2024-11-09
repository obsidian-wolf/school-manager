import db from '../../infrastructure/db';

export type PrescriberyWebhookRequest = {
	date: Date;
	request: any;
};

const prescriberyWebhookRequestCollection = db.collection<PrescriberyWebhookRequest>(
	'prescribery_webhook_request',
);

export async function logWebhookRequest(request: any) {
	const result = await prescriberyWebhookRequestCollection.insertOne({
		date: new Date(),
		request,
	});
	return result.insertedId.toString();
}
