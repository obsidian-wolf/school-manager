import { addMonths } from 'date-fns';
import { paymentPostback } from '../../../integrations/prescribery/payment_postback';

import { parseError } from '../../../utils/axios';
import { getOrder, updateOrder } from '../../collection';
import { times } from '../../../utils/times';
import { BadRequest } from '../../../infrastructure/common/errors';
import { getWebUrl } from '../../../helpers/get_web_url';
import { getPayInFullTrinityCommissions } from '../../trinity/get_trinity_commissions';
import { InstallmentProduct } from '../../types';
import { getPayInFullProductPrice, getPayOverTimeProductPrice } from '../../../resources/products';
import { genUuid } from '../../../utils/gen_uuid';
import config from '../../../config';
import { getStateRulesFromOrder } from '../first_time/prescribery/get_state_rules_from_order';
import { PaymentDetails } from '../../../integrations/nexio/get_payment_details';
import { ProcessCardResponse } from '../../../integrations/nexio/process_card';
import { createAsyncAppointment } from '../first_time/prescribery/create_appointment';
import { getSlotsForOrder } from '../first_time/prescribery/get_appointments';
import { sendMessage } from '../../../integrations/slack/send_message';
import { processQuestionnaires } from '../first_time/prescribery/process_questionnaires';

export type ProcessNexioPayment = {
	orderId: string;
	nexioPaymentId: string;
	payInFull: boolean;
};

export type NexioPayment = {
	paymentId?: string;
	paymentDetails?: PaymentDetails;
	processCardResponse?: ProcessCardResponse;
	error?: any;
	type: 'nexio';
};

export async function processNexioPayment(request: ProcessNexioPayment): Promise<string> {
	const { orderId, nexioPaymentId, payInFull } = request;
	const order = await getOrder(orderId);

	if (order.status !== 'pending') {
		throw new BadRequest('Order already processed');
	}
	if (order.type === 'ad_hoc') {
		throw new BadRequest('Ad hoc order cannot be processed');
	}

	if (!payInFull) {
		const maxMonth = order.products.reduce((max, item) => {
			return Math.max(max, item.product.payOverTimePlan?.length || 0);
		}, 0);

		order.installments = times(maxMonth, (month) => {
			const dueDate = addMonths(new Date(), month);
			const products: InstallmentProduct[] = order.products
				.map((orderProduct) => ({
					id: orderProduct.product.id,
					amount: getPayOverTimeProductPrice(orderProduct.product, month),
					quantity: 1,
					trinityCommissions: [
						{
							dueDate,
							month,
						},
					],
				}))
				.filter((p) => p.amount > 0);

			return {
				id: genUuid(),
				dueDate,
				status: month === 0 ? 'paid' : 'pending',
				amount: products.reduce((sum, product) => sum + product.amount, 0),
				payment: {
					type: 'nexio',
					paymentId: nexioPaymentId,
					date: new Date(),
				},
				products,
				payInFull: false,
			};
		});
		order.status = 'active';
	} else {
		const products: InstallmentProduct[] = order.products.map((orderProduct) => ({
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
					type: 'nexio',
					paymentId: nexioPaymentId,
					date: new Date(),
				},
				products,
				payInFull: true,
			},
		];
		order.status = 'completed';
	}
	order.products.forEach((orderProduct) => {
		orderProduct.status =
			!payInFull && orderProduct.product.payOverTimePlan ? 'active' : 'completed';
	});

	order.session = {};

	let noAppointmentAvailable = false;

	try {
		// reassessments
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
					type: 'nexio',
					orderId,
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
			type: 'nexio',
		});
	} finally {
		await updateOrder(orderId, order, {
			action: 'process_nexio_payment',
			...request,
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
