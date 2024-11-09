import config from '../../../config';
import { getWebUrl } from '../../../helpers/get_web_url';
import { BadRequest } from '../../../infrastructure/common/errors';
import { capture, CaptureResponse } from '../../../integrations/afterpay/capture';
import { paymentPostback } from '../../../integrations/prescribery/payment_postback';
import { getStateRulesFromOrder } from '../first_time/prescribery/get_state_rules_from_order';
import { getPayInFullProductPrice } from '../../../resources/products';
import { parseError } from '../../../utils/axios';
import { genUuid } from '../../../utils/gen_uuid';
import { getOrder, updateOrder } from '../../collection';
import { getPayInFullTrinityCommissions } from '../../trinity/get_trinity_commissions';
import { getSlotsForOrder } from '../first_time/prescribery/get_appointments';
import { createAsyncAppointment } from '../first_time/prescribery/create_appointment';
import { sendMessage } from '../../../integrations/slack/send_message';
import { processQuestionnaires } from '../first_time/prescribery/process_questionnaires';

export type ProcessAfterpayPayment = {
	orderId: string;
	captureResponse?: CaptureResponse;
	error?: any;
};

export type AfterpayPayment = {
	success?: CaptureResponse;
	error?: any;
	type: 'afterpay';
};

export async function processAfterpayPayment(
	orderId: string,
	success: boolean,
	afterpayOrderToken: string,
): Promise<string> {
	const order = await getOrder(orderId);

	if (order.status !== 'pending') {
		throw new BadRequest('Order already processed');
	}
	if (order.type === 'ad_hoc') {
		throw new BadRequest('Ad hoc order cannot be processed');
	}

	const action: ProcessAfterpayPayment = {
		orderId,
		captureResponse: undefined,
		error: undefined,
	};

	if (!success) {
		action.error = 'Payment not successfull';
	} else {
		try {
			action.captureResponse = await capture({
				token: afterpayOrderToken,
			});
		} catch (err) {
			action.error = parseError(err);
		}
	}

	order.session = {};

	let noAppointmentAvailable = false;

	try {
		if (action.captureResponse?.status !== 'APPROVED') {
			throw new BadRequest('Payment not approved');
		}
		const products = order.products.map((orderProduct) => ({
			id: orderProduct.product.id,
			amount: getPayInFullProductPrice(orderProduct.product),
			quantity: 1,
			trinityCommissions: getPayInFullTrinityCommissions(orderProduct.product),
		}));
		order.installments = [
			{
				id: genUuid(),
				dueDate: new Date(),
				status: 'paid',
				amount: products.reduce((sum, product) => sum + product.amount, 0),
				payment: {
					type: 'afterpay',
					success: action.captureResponse,
					date: new Date(),
				},
				products,
				payInFull: true,
			},
		];

		order.products.forEach((orderProduct) => {
			orderProduct.status = 'completed';
		});

		order.status = 'completed';

		if (order.type === 'reassessment') {
			try {
				const prescriberySuccessResult = await paymentPostback({
					assessment_token: order.prescribery.request.assessment_token,
					status: 'paid',
					shippingInfo: order.personalInfo.shipping!,
				});

				order.prescribery.successResponse = prescriberySuccessResult;

				return getWebUrl({
					path: '/success',
					orderId,
					type: 'afterpay',
					redirectUrl: order.prescribery.request.redirect_url,
				});
			} catch (err) {
				order.prescribery.errorResponse = parseError(err);
				throw new BadRequest('prescribery', {});
			}
		}

		order.prescribery = await processQuestionnaires(order.personalInfo, order.prescribery);

		const stateRules = await getStateRulesFromOrder(order);
		order.prescribery.isSync = stateRules?.establishingCare !== 'asyncApptMode';

		if (!order.prescribery.isSync) {
			await createAsyncAppointment({ order });
			return `${config.WP_URL}/payment-confirmation/?payment_status=success&orderId=${orderId}&no_appointments=false`;
		}

		const slots = await getSlotsForOrder(order);

		if (!slots || Object.keys(slots).length === 0) {
			noAppointmentAvailable = true;
			return `${config.WP_URL}/payment-confirmation/?payment_status=success&orderId=${orderId}&no_appointments=true`;
		}

		return getWebUrl({
			path: '/appointment',
			orderId,
			type: 'afterpay',
		});
	} finally {
		await updateOrder(orderId, order, {
			...action,
			action: 'process_afterpay_payment',
		});

		if (noAppointmentAvailable && order.type === 'first_time') {
			order.prescribery.noAppointmentAvailable = true;
			await sendMessage(`
				No appointment available for:
				• Order: ${orderId}
				• Email: ${order.personalInfo.user.email}
				• Phone: ${order.personalInfo.user.phone}
				• Name: ${order.personalInfo.user.firstName} ${order.personalInfo.user.lastName}
				• Products: ${order.products.map((product) => product.product.id).join(', ')}`);
			await updateOrder(orderId, order, {
				action: 'set_prescribery_no_appointment_available',
				noAppointmentAvailable: true,
			});
		}
	}
}
