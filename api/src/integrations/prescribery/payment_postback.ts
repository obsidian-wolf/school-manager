import { api } from '.';
import { Address } from '../../resources/address';

export type PaymentPostbackRequest = {
	assessment_token: string;
	status: 'paid' | 'denied' | 'pending';
	shippingInfo: Address;
};

export type PaymentPostbackResponse = {
	message: string;
};

export async function paymentPostback(request: PaymentPostbackRequest) {
	const results = await api.post<PaymentPostbackResponse>('/api/payment-wp-webhook', request); // TODO add type
	return results.data;
}
