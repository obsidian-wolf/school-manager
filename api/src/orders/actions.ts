import { PrescriberyReassessmentPaymentRequest } from './default/reassessment/prescribery/reassessment';
import { CreateOrderFromExistingReassessment } from './default/reassessment/prescribery/recreate_reassessment';
import { CreateAdHocOrderInstallment } from './ad_hoc/create_order_installment';
import { ProcessOrderInstallment } from './ad_hoc/process_nexio_payment';
import { BillingAndShippingInfoRequest } from './default/submit_billing_and_shipping';
import { Product } from '../resources/products';
import { NexioUrl } from '../integrations/nexio/get_token';
import { CheckoutResponse } from '../integrations/afterpay/checkout';
import { TrinityCommission } from './trinity/types';
import { UpgradeOrderProduct } from './default/upgrade_order_product';
import { ProcessNexioPayment } from './default/nexio/process_nexio_payment';
import { ProcessAfterpayPayment } from './default/afterpay/process_afterpay_payment';
import { QuestionnaireRequest } from './default/first_time/questionnaire/collection';
import { ProcessOverTimePayment } from './default/process_pay_over_time';

type CreateOrderFromQuestionnairesAction = {
	action: 'create_order_from_questionnaires';
	entry: string;
};

type ProcessNexioPaymentAction = ProcessNexioPayment & {
	action: 'process_nexio_payment';
};

type ProcessAfterpayPaymentAction = ProcessAfterpayPayment & {
	action: 'process_afterpay_payment';
};

type CreateOrderFromReassessmentRequestAction = {
	reassessmentRequest: PrescriberyReassessmentPaymentRequest;
	action: 'create_order_from_reassessment_request';
};

type CreateOrderFromExistingReassessmentAction = CreateOrderFromExistingReassessment & {
	action: 'create_order_from_existing_reassessment';
};

type CreateAdHocOrderInstallmentAction = CreateAdHocOrderInstallment & {
	action: 'create_ad_hoc_order_installment';
};

type ProcessOrderInstallmentAction = ProcessOrderInstallment & {
	action: 'process_order_installment';
};

type CancelOrderAction = {
	action: 'cancel_order';
	reason?: string;
};

type UpgradeOrderAction = {
	action: 'upgrade_order';
	fromProduct: Product;
	toProduct: Product;
};

type SubmitBillingAndShippingAction = BillingAndShippingInfoRequest & {
	action: 'submit_billing_shipping';
};

/**
 * TODO: this doesn't make sense because it is not tied to an order at all.
 */
type CreateQuestionnaireAction = QuestionnaireRequest & {
	action: 'create_questionnaire';
	questionnaireId: string;
};

/**
 * TODO: I don't think we need this.  There is a reason I put the nexio url in the order session.
 * the session field is for truly temporary data that is not part of the order itself.  ie. it can be
 * cleared at any time without issue.  I don't want the log to be populated by hundreds of nexio urls.
 * Plus - there are more than one nexio url type (installment, upgrade, etc)
 */
type SetNexioUrlAction = {
	action: 'set_nexio_url';
	installmentId?: string;
	nexioUrl: NexioUrl;
};

type ProcessAfterpayCheckoutAction = CheckoutResponse & {
	action: 'process_afterpay_checkout';
};

type SetPrescriberyNoAppointmentAvailableAction = {
	action: 'set_prescribery_no_appointment_available';
	noAppointmentAvailable: boolean;
};

type CreateSyncPrescriberyAppointmentAction = {
	action: 'create_sync_prescribery_appointment';
	startDate: string;
	startTime: string;
	endTime: string;
	memberId: number;
	appointmentId: number;
};

type CreateAsyncPrescriberyAppointmentAction = {
	action: 'create_async_prescribery_appointment';
	memberId: number;
	appointmentId: number;
};

type SyncVoidedNexioAction = {
	action: 'sync_voided_nexio';
	cancelledTransactionIds: number[];
	affectedProductIds: string[];
};

type ProcessOrderSubmissionAction = {
	action: 'process_order_submission';
	updatedTrinityCommissions: TrinityCommission[];
};

type UpgradeOrderProductAction = UpgradeOrderProduct & {
	action: 'upgrade_order_product';
};

type CreateOrderFromPaymentRequest = {
	action: 'create_order_from_payment_request';
	paymentRequestId: string;
};

type ProcessOverTimePaymentAction = ProcessOverTimePayment & {
	action: 'process_over_time_payment';
};

export type OrderAction =
	| CreateOrderFromQuestionnairesAction
	| ProcessNexioPaymentAction
	| ProcessAfterpayPaymentAction
	| CreateOrderFromReassessmentRequestAction
	| CreateOrderFromExistingReassessmentAction
	| CreateAdHocOrderInstallmentAction
	| ProcessOrderInstallmentAction
	| CancelOrderAction
	| UpgradeOrderAction
	| SubmitBillingAndShippingAction
	| CreateQuestionnaireAction
	| SetNexioUrlAction
	| ProcessAfterpayCheckoutAction
	| SetPrescriberyNoAppointmentAvailableAction
	| CreateSyncPrescriberyAppointmentAction
	| CreateAsyncPrescriberyAppointmentAction
	| SyncVoidedNexioAction
	| ProcessOrderSubmissionAction
	| UpgradeOrderProductAction
	| CreateOrderFromPaymentRequest
	| ProcessOverTimePaymentAction;
