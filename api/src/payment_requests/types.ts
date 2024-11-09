import { TrinityProduct } from '../orders/trinity/types';

/**
 * @deprecated
 */
export type PaymentRequest = {
	createdAt: Date;
	prescriberyRequest: {
		first_name: string;
		last_name: string;
		email: string;
		dob: string;
		gender: string;
		lead_id: number;
		assessment_id: number;
		redirect_url: string;
		assessment_token: string;
		plan: {
			amount: string;
			medication: string;
		};
	};
	processed?: boolean;
	prescriberyIsFirstTime: boolean;
	medication: {
		name: string;
		url: string;
		tier: number;
		trinityId: string;
		retailPrice: number;
		wholesalePrice: number;
		psvAmount: number;
		uplineVolume: number;
		ellieInstallments: number[];
		monthSupply: number;
	};
	parentId: string | null;
	user: {
		email: string;
		firstName: string;
		lastName: string;
		dob: string;
		gender: string;
		dealerId: number;
		address: string;
		city: string;
		postcode: string;
		state: string;
		stateCode: string;
		phone: string;
		middleName: string;
	};
	billing: {
		address: string;
		city: string;
		email: string;
		firstName: string;
		lastName: string;
		middleName: string;
		phone: string;
		postcode: string;
		stateCode: string;
	};
	shipping: {
		address: string;
		city: string;
		email: string;
		firstName: string;
		lastName: string;
		middleName: string;
		phone: string;
		postcode: string;
		stateCode: string;
	};
	nexioInstallmentUrl: {
		expiration: string;
		token: string;
		fraudUrl: string;
		url: string;
	};
	nexioUrl: {
		expiration: string;
		token: string;
		fraudUrl: string;
		url: string;
	};
	afterpayUrl: {
		token: string;
		expires: string;
		redirectCheckoutUrl: string;
	};
	squareInstallments?: any[];
	stripeInstallments?: any[];
	nexioInstallments?: any[];
	partial?: boolean;
	trinityPayments?: {
		dealer?: any;
		dealerId: number;
		product: TrinityProduct;
		payments?: {
			amount?: number;
			date?: Date;
			paid?: boolean;
			error?: any;
			result?: any;
			void?: any;
		}[];
	};
};
