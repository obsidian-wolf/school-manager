import { api } from '.';
import { RunCardTransaction } from './get_token';

export type ProcessCard = RunCardTransaction & {
	tokenex: {
		token: string;
	};
};

// https://docs.nexiopay.com/reference/runcardtransaction
export async function processCard(request: ProcessCard) {
	// TODO: content
	const { data } = await api.post<ProcessCardResponse>(`/pay/v3/process`, request);
	return data;
}

export type ProcessCardResponse = {
	id: string;
	merchantId: string;
	transactionDate: string;
	authCode: string;
	transactionStatus: string;
	amount: number;
	transactionType: string;
	currency: string;
	gatewayResponse: {
		refNumber: string;
		gatewayName: string;
	};
	data: {
		amount: number;
		currency: string;
		settlementCurrency: string;
		customer: {
			firstName: string;
			lastName: string;
			shipToCountry: string;
			customerRef: string;
			email: string;
			billToCountry: string;
			orderNumber: string;
			orderDate: string;
			birthDate: string;
			billToAddressOne: string;
			billToCity: string;
			billToState: string;
			billToPostal: string;
			phone: string;
			shipToAddressOne: string;
			shipToCity: string;
			shipToState: string;
			shipToPostal: string;
			createdAtDate: string;
		};
		cart: {
			items: {
				item: string;
				description?: string;
				quantity: number;
				price: number;
				type?: 'sale';
			}[];
		};
	};
	card: {
		cardNumber: string;
		cardType: string;
		expirationYear: string;
		expirationMonth: string;
		cardHolder: string;
	};
	kountResponse: {
		status: string;
		rules: string;
	};
	token: {
		firstSix: string;
		lastFour: string;
		token: string;
	};
	[key: string]: any; // To account for dynamic keys like "random-5017942"
};
