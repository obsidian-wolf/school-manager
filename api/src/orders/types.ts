import { Product, ProductId } from '../resources/products';
import { PersonalInfo } from '../resources/personal_info';
import { TrinityCommission } from './trinity/types';
import { NexioUrl } from '../integrations/nexio/get_token';
import { CheckoutResponse } from '../integrations/afterpay/checkout';
import { OrderAction } from './actions';
import { PrescriberyFirstTime } from './default/first_time/prescribery/types';
import { PrescriberyReassessment } from './default/reassessment/prescribery/types';
import { AfterpayPayment } from './default/afterpay/process_afterpay_payment';
import { NexioPayment } from './default/nexio/process_nexio_payment';
import { ObjectId } from 'mongodb';

export type Log = {
	date: Date;
} & OrderAction;

export type Payment = {
	date: Date;
} & PaymentPayload;

export type PaymentPayload = AfterpayPayment | NexioPayment;

export type Order = {
	createdAt: Date;
	personalInfo: PersonalInfo;
	status:
		| 'pending' // when an order has been created, but no payment made
		| 'active' // when a subset of installments have been paid
		| 'completed' // when all payments have been made
		| 'voided' // when nothing has been paid, and all products have been cancelled (as if it never existed)
		| 'cancelled'; // when all products have been cancelled

	installments: Installment[];
	products: OrderProduct[];

	logs: Log[];

	/**
	 * A link to the old structure.
	 */
	paymentRequestId?: ObjectId;

	/**
	 * Temporary session data that can be cleared any time.
	 */
	session: {
		nexioPayInFullUrl?: NexioUrl;
		nexioPayOverTimeUrl?: NexioUrl;
		afterpayCheckoutResponse?: CheckoutResponse;
	};
} & (
	| {
			type: 'first_time';
			prescribery: PrescriberyFirstTime;
	  }
	| {
			type: 'reassessment';
			prescribery: PrescriberyReassessment;
	  }
	| {
			/**
			 * Note that you can still make ad_hoc payments on both first_time and reassessment orders.
			 *
			 * ad_hoc orders are when payments are made to an order that does not exist in the system.
			 */
			type: 'ad_hoc';
	  }
);

export type InstallmentProduct = {
	id: ProductId;
	/**
	 * Price of one product in USD.  The sum of this must be equal to the amount of the installment.
	 */
	amount: number;
	/**
	 * Quantity of the product
	 */
	quantity: number;
	isUpgrade?: boolean;
	trinityCommissions: TrinityCommission[];
};

export type Installment = {
	id: string;
	dueDate?: Date;
	amount: number;
	status:
		| 'pending' // awaiting payment
		| 'paid' // payment made
		| 'refunded' // payment made, and then refunded
		| 'voided'; // no payment made, and then cancelled

	products: InstallmentProduct[];
	/**
	 * To indicate if all the products in this installment have been paid in full with this one installment.
	 */
	payInFull: boolean;
	payment?: Payment;
	session?: {
		nexioUrl?: NexioUrl;
	};
};

export type OrderProduct = {
	product: Product;
	status:
		| 'active' // when a subset of the product has been paid
		| 'cancelled' // when the product was cancelled after making payments
		| 'voided' // when the product was cancelled before making payments
		| 'completed' // when the product was fully paid
		| 'upgraded'; // when the product was upgraded to something else
	upgradedFrom?: ProductId;
};

export type SuccessRedirect = 'nexio' | 'afterpay' | 'prescribery';
export type ErrorRedirect = 'nexio' | 'afterpay' | 'prescribery' | 'unknown' | 'already_processed';

export type SuccessErrorResponse = {
	success?: SuccessRedirect;
	successMessage?: string;
	successRedirect?: string;

	error?: ErrorRedirect;
	errorMessage?: string;
	errorRedirect?: string;
};
