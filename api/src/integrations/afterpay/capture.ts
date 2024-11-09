import { api } from '.';

export type CaptureRequest = {
	token: string;
	merchantReference?: string;
};

// Note: haven't specified optionals
export type CaptureResponse = {
	id: string;
	token: string;
	status: 'APPROVED' | 'DECLINED';
	created: string;
	originalAmount: {
		amount: string;
		currency: string;
	};
	openToCaptureAmount: {
		amount: string;
		currency: string;
	};
	paymentState:
		| 'AUTH_APPROVED'
		| 'AUTH_DECLINED'
		| 'PARTIALLY_CAPTURED'
		| 'CAPTURED'
		| 'CAPTURE_DECLINED'
		| 'VOIDED';
	merchantReference: string;
	refunds: any[];
	orderDetails: {
		consumer: Record<string, any>;
		billing: {
			name: string;
			line1: string;
			postcode: string;
			countrycode: string;
			phoneNumber: string;
		};
		shipping: {
			name: string;
			line1: string;
			postcode: string;
			countrycode: string;
			phoneNumber: string;
		};
		courier: {
			shippedAt: string;
			name: string;
			tracking: string;
			priority: string;
		};
		items: {
			name: string;
			sku: string;
			quantity: number;
			price: {
				amount: string;
				currency: string;
			};
		};
		categories: {
			name: string;
			sku: string;
			quantity: number;
			price: {
				amount: string;
				currency: string;
			};
			categories: null;
		};
	};
	discounts: any[];
	shippingAmount: {
		amount: string;
		currency: string;
	};
	taxAmount: {
		amount: string;
		currency: string;
	};
	events: {
		id: string;
		created: string;
		expires: string | null;
		type: string;
		amount: {
			amount: string;
			currency: string;
		};
		paymentEventMerchantReference: string;
	};
};

// https://developers.afterpay.com/docs/api/reference/immediate-payment-flow/operations/create-a-v-2-payment-capture
export async function capture(request: CaptureRequest) {
	const { data } = await api.post<CaptureResponse>('/v2/payments/capture', request);
	return data;
}
