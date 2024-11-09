import { api } from '.';

// https://docs.nexiopay.com/reference/viewtransactionpaymentid
export async function getPaymentDetails(nexioPaymentId: string) {
	// TODO: content
	const { data } = await api.get<PaymentDetails>(`/transaction/v3/paymentId/${nexioPaymentId}`);
	return data;
}

export type PaymentDetails = {
	id: number;
	merchantId: string;
	transactionDate: string; // ISO date string
	amount: number;
	authCode: string;
	transactionStatus: number;
	transactionType: number;
	cardType: number;
	cardNumber: string;
	cardHolder: string;
	processMethod: number;
	achDetailId: number | null;
	currencyId: string;
	reportDate: string | null;
	settledDate: string | null;
	capturedDate: string; // ISO date string
	originalTransactionId: number | null;
	createdAt: string; // ISO date string
	updatedAt: string; // ISO date string
	customer: {
		id: number;
		firstName: string;
		lastName: string;
		postalCode: string;
		phone: string | null;
		email: string;
		company: string | null;
		customerRef: string;
		transactionId: number;
	};
	kount: {
		id: number;
		status: string;
		rules: string; // JSON string
		refNumber: string;
		merc: string;
		score: string;
		ruleCount: number;
		warningCount: number;
		counterCount: number;
		wasDeviceFingerprinted: boolean;
		mode: string;
		velo: number;
		vmax: number;
		transactionId: number;
	};
	bankTransfer: null;
	plugin: {
		id: number;
		originalId: string;
		invoice: string | null;
		orderNumber: string;
		description: string | null;
		userId: number | null;
		pluginType: number;
		paymentOptionTag: string | null;
		transactionId: number;
	};
	gateway: {
		id: number;
		merchantId: string;
		batchRef: string | null;
		refNumber: string;
		additionalRefNumber: string | null;
		trackingCode: string | null;
		processorLinkId: string | null;
		gatewayType: number;
		message: string;
		nsu: string | null;
		transactionId: number;
	};
	processor: null;
	foreignProcessingCurrency: null;
	threeDS: null;
	customerAddresses: {
		id: number;
		billingAddressOne: string;
		billingAddressTwo: string | null;
		billingCity: string;
		billingState: string;
		billingPostalCode: string;
		billingCountry: string;
		billingPhone: string | null;
		shippingAddressOne: string;
		shippingAddressTwo: string | null;
		shippingCity: string;
		shippingState: string;
		shippingPostalCode: string;
		shippingCountry: string;
		shippingPhone: string | null;
		transactionId: number;
	};
	transactionDetails: {
		id: number;
		description: string | null;
		clientIp: string;
		userName: string;
		shoppingCart: string; // JSON string
		customFields: string | null;
		retryCount: number | null;
		paymentType: string;
		installments: number | null;
		installmentUnit: string | null;
		surcharge: number | null;
		transactionId: number;
	};
	subscription: null;
	cardMetaData: {
		id: number;
		cardBrand: string;
		class: number;
		currencyCode: string;
		countryCode: string;
		issuingBank: string;
		bin: string;
		transactionId: number;
	};
	merchantFilterLogic: {
		id: number;
		transactionId: number;
		logic: string; // JSON string
	};
	linkedChargebackId: number | null;
};
