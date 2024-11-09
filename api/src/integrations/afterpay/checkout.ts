import { api } from '.';

export type CheckoutRequest = {
	amount: {
		amount: string; // must be rounded to 2 decimal places
		currency: 'USD';
	};
	consumer: {
		email: string;
		givenNames?: string;
		surname?: string;
		phoneNumber?: string;
	};
	merchantReference: string;
	billing: {
		name: string;
		line1: string;
		line2?: string;
		area1: string; // city
		region: string; // state
		postcode: string;
		countryCode: 'US';
		phoneNumber?: string;
	};
	shipping: {
		name: string;
		line1: string;
		line2?: string;
		area1: string; // city
		region: string; // state
		postcode: string;
		countryCode: 'US';
		phoneNumber?: string;
	};
	merchant: {
		redirectConfirmUrl: string;
		redirectCancelUrl: string;
		popupOriginUrl?: string;
		name?: string; // Ellie MD
	};
	items?: {
		name: string;
		sku?: string;
		quantity: number;
		pageUrl?: string;
		imageUrl?: string;
		price: {
			amount: string;
			currency: 'USD';
		};
		categories?: string[][];
		estimatedShipmentDate?: string; // 2023-08-01
		preorder?: boolean;
	}[];
	courier?: {
		shippedAt?: string;
		name?: string;
		tracking?: string;
		priority?: string;
	};
	taxAmount?: {
		amount: string;
		currency: 'USD';
	};
	shippingAmount?: {
		amount: string;
		currency: 'USD';
	};
	discounts?: {
		displayName: string;
		amount: {
			amount: string;
			currency: string;
		};
	}[];
	description?: string;
};

export type CheckoutResponse = {
	token: string;
	expires: string; // ISO
	redirectCheckoutUrl: string;
};

// https://developers.afterpay.com/docs/api/reference/checkouts/operations/create-a-v-2-checkout
export async function checkout(request: CheckoutRequest) {
	const { data } = await api.post<CheckoutResponse>('/v2/checkouts', request);
	return data;
}
