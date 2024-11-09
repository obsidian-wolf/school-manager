import { format } from 'date-fns';
import { RunCardTransaction } from './get_token';
import { PersonalInfo } from '../../resources/personal_info';

export function getRunCardTransactionPayload({
	personalInfo,
	amount,
	orderNumber,
	items,
	isInitialPayment,
}: {
	personalInfo: PersonalInfo;
	amount: number;
	orderNumber: string;
	isInitialPayment: boolean;
	items: {
		item: string;
		quantity: number;
		price: number;
		type: 'sale';
	}[];
}): RunCardTransaction {
	const { billing, shipping, user } = personalInfo;

	return {
		data: {
			amount,
			currency: 'USD',
			// allowedCardTypes
			cart: {
				items,
			},
			customer: {
				customerRef: billing.email,
				orderNumber,
				orderDate: new Date().toISOString(), // 2001-08-26T13:35:00.978Z or 1990-12-05T00:00:00.000Z or 1990-12-05
				// invoice?: string;
				firstName: user.firstName,
				lastName: user.lastName,
				birthDate: user.dob && format(user.dob, 'yyyy-MM-dd'), // 1990-12-05
				// nationalIdentificationNumber?: string;
				billToAddressOne: billing.address,
				// billToAddressTwo?: string;
				billToCity: billing.city,
				billToState: billing.stateCode,
				billToPostal: billing.postcode,
				billToCountry: 'US',
				// billToPhone?: string;
				email: billing.email,
				phone: user.phone,
				shipToAddressOne: shipping.address,
				// shipToAddressTwo?: string;
				shipToCity: shipping.city,
				shipToState: shipping.stateCode,
				shipToPostal: shipping.postcode,
				shipToCountry: 'US',
				// shipToPhone?: string;
				createdAtDate: new Date().toISOString(), // 2001-08-26T13:35:00.978Z or 1990-12-05T00:00:00.000Z or 1990-12-05
			},
			// customFields?: Record<string, string>;
			// description?: string;
			// descriptor?: string;
			// lodging
			// surcharge?: number;
		},
		processingOptions: {
			paymentType: isInitialPayment ? 'initialUnscheduled' : 'unscheduledCit',
			saveCardToken: true,
			// paymentOptionTag?: string;
			// retryOnSoftDecline?: boolean;
			checkFraud: true,
			shouldUseFingerprint: true,
			check3ds: false,
			// customerRedirectUrl?: string;
			// merchantId?: string;
			// verboseResponse?: boolean;
		},
		// card?: {
		// 	cardHolderName?: string;
		// 	expirationMonth?: string; // 12
		// 	expirationYear?: string; // 23
		// 	classification?: 'business' | 'personal';
		// 	businessNumber?: string; // 10 digit number
		// 	password?: string; // 12
		// };
		// installment?: {
		// 	period?: number;
		// };
		isAuthOnly: false,
		uiOptions: {
			// // amountSet?: string;
			// css?: string;
			// customTextUrl?: string;
			displaySubmitButton: false,
			hideBilling: true,
			// hideCvc?: boolean;
			// limitCountriesTo?: string[];
			requireCvc: true,
			// forceExpirationSelection?: boolean;
		},
	};
}
