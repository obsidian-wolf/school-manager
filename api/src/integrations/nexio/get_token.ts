import { api, cssUrl } from '.';

// https://docs.nexiopay.com/reference/createonetimeusetoken
async function getOneTimeToken(request: RunCardTransaction) {
	request.uiOptions = request.uiOptions || {};
	request.uiOptions.css = cssUrl;
	const { data } = await api.post<OneTimeTokenResponse>('/pay/v3/token', request);
	return data;
}

// https://docs.nexiopay.com/reference/runcardtransactioniframe
export async function getNexioUrl(request: RunCardTransaction): Promise<NexioUrl> {
	const token = await getOneTimeToken(request);
	return {
		...token,
		url: `${api.defaults.baseURL}/pay/v3?shouldReturnHtml=false&token=${token.token}`,
	};
}

export async function _getSampleCardTransactionUrl() {
	return getNexioUrl(sampleRequest);
}

export type NexioUrl = OneTimeTokenResponse & { url: string };

export type OneTimeTokenResponse = {
	expiration: string; // ISO
	token: string;
	fraudUrl: string;
};

export type Customer = {
	customerRef?: string;
	orderNumber: string;
	orderDate?: string; // 2001-08-26T13:35:00.978Z or 1990-12-05T00:00:00.000Z or 1990-12-05
	invoice?: string;
	firstName?: string;
	lastName?: string;
	birthDate?: string; // 1990-12-05
	nationalIdentificationNumber?: string;
	billToAddressOne?: string;
	billToAddressTwo?: string;
	billToCity?: string;
	billToState?: string;
	billToPostal?: string;
	billToCountry?: string;
	billToPhone?: string;
	email?: string;
	phone?: string;
	shipToAddressOne?: string;
	shipToAddressTwo?: string;
	shipToCity?: string;
	shipToState?: string;
	shipToPostal?: string;
	shipToCountry?: string;
	shipToPhone?: string;
	createdAtDate?: string; // 2001-08-26T13:35:00.978Z or 1990-12-05T00:00:00.000Z or 1990-12-05
};

// "orderDate entered is an invalid date or is an invalid format. Correct date formats are YYYY-MM-DD, ISO (see documentation), or UNIX in seconds"

export type RunCardTransaction = {
	data: {
		amount: number;
		currency: 'USD';
		// allowedCardTypes
		cart?: {
			items: {
				item: string;
				description?: string;
				quantity: number;
				price: number;
				type?: 'sale';
			}[];
		};
		customer?: Customer;
		customFields?: Record<string, string>;
		description?: string;
		descriptor?: string;
		// lodging
		surcharge?: number;
	};
	processingOptions: {
		paymentType:
			| 'initialScheduled'
			| 'initialUnscheduled'
			| 'scheduled'
			| 'unscheduledCit'
			| 'unscheduledMit'
			| 'initialMoto';
		saveCardToken?: boolean;
		paymentOptionTag?: string;
		retryOnSoftDecline?: boolean;
		checkFraud?: boolean;
		shouldUseFingerprint?: boolean;
		check3ds?: boolean;
		customerRedirectUrl?: string;
		merchantId?: string;
		verboseResponse?: boolean;
	};
	card?: {
		cardHolderName?: string;
		expirationMonth?: string; // 12
		expirationYear?: string; // 23
		classification?: 'business' | 'personal';
		businessNumber?: string; // 10 digit number
		password?: string; // 12
	};
	installment?: {
		period?: number;
	};
	isAuthOnly?: boolean;
	uiOptions?: {
		amountSet?: string;
		css?: string;
		customTextUrl?: string;
		displaySubmitButton?: boolean;
		hideBilling?: boolean;
		hideCvc?: boolean;
		limitCountriesTo?: string[];
		requireCvc?: boolean;
		forceExpirationSelection?: boolean;
	};
};

const sampleRequest: RunCardTransaction = {
	card: {
		cardHolderName: 'Todd Risenmay',
	},
	// shouldUpdateCard: true,
	data: {
		amount: 200,
		currency: 'USD',
		description: 'test purchase',
		cart: {
			items: [
				{
					item: 'E100',
					description: 'Electric Socks',
					quantity: 2,
					price: 5,
					type: 'sale',
				},
			],
		},
		customFields: {
			custom1: 'Blue',
			custom2: 'Leave on porch',
		},
		customer: {
			invoice: 'invoice123',
			orderNumber: '4624b6bd25418f8532cc',
			customerRef: 'customer123',
			firstName: 'Nexio',
			lastName: 'Test',
			phone: '8015551234',
			email: 'nexiotest@example.com',
			billToAddressOne: '123 Test St',
			billToAddressTwo: 'Suite 123',
			billToCity: 'Testerville',
			billToState: 'UT',
			billToPostal: '12345',
			billToCountry: 'US',
			billToPhone: '8015551234',
			shipToAddressOne: '123 Ship St',
			shipToAddressTwo: 'Warehouse 456',
			shipToCity: 'Shipperville',
			shipToState: 'OR',
			shipToPostal: '67890',
			shipToCountry: 'US',
			shipToPhone: '5033335678',
		},
		// lodging: {
		// 	noShow: false,
		// 	advanceDeposit: false,
		// 	checkInDate: '',
		// 	checkOutDate: '',
		// 	roomNumber: '',
		// 	roomRate: 0,
		// },
	},
	processingOptions: {
		checkFraud: true,
		paymentType: 'unscheduledCit',
		// paymentOptionTag: null,
		saveCardToken: true,
	},
	uiOptions: {
		css: cssUrl,
		// amountSet: '200',
		// amountDefault: null,
		// amountMax: null,
		// merchantIdSet: null,
		// merchantIdDefault: null,
		// hideAuthOnly: true,
		hideBilling: false,
		// hideShipping: false,
		// hideCustomerInfo: false,
		// hideOrderInfo: false,
		// fields: null,
		// limitCountriesTo: ['CA', 'MX', 'GB', 'US'],
	},
};

// POST https://api.nexiopaysandbox.com/apm/v3/token \
// Content-Type: application/json
// Accept: application/json
// Authorization: Basic Y2pAZWxsaWVtZC5jb206c3FhYVRtYXU5UXJBTExqOGhORlI=

// {
//   "data": {
//     "amount": 29.99,
//     "currency": "USD",
//     "customer": {
//       "firstName": "Maria",
//       "lastName": "Velasquez",
//       "email": "mvelaquez@example.com",
//       "orderNumber": "210058A"
//       "billToAddressOne": "123"
//       "billToCity":"afsd"
//       "billToState": "NY"
//       "billToPostal": "123123"
//       "billToCountry": "USA"
//     }
//   },
//   "customerRedirectUrl": "https://[your-ecommerce-website]"
// }

// "paymentMethod": "applePayAuthNet",
