import { differenceInMinutes, parse } from 'date-fns';
import {
	postAppointment,
	AppointmentRequest,
} from '../../../../integrations/prescribery/doctalkgo/appointment';
import { getOrder, updateOrder } from '../../../collection';
import { BadRequest } from '../../../../infrastructure/common/errors';
import { Order } from '../../../types';
import { WithId } from 'mongodb';
import { getMembers } from '../../../../integrations/prescribery/doctalkgo/members';
import { getProductPrescriberySource } from '../../../../resources/products';
import { getStateRulesFromOrder } from './get_state_rules_from_order';

export type CreateSyncAppointmentRequest = {
	memberId: number;
	startDate: string;
	startTime: string;
	endTime: string;
};

export async function createSyncAppointment(
	request: CreateSyncAppointmentRequest & {
		orderId: string;
	},
) {
	const { memberId, orderId, startDate, startTime, endTime } = request;
	const order = await getOrder(orderId);

	if (order.type !== 'first_time') {
		throw new BadRequest('Order is not a first time order');
	}
	if (order.prescribery?.appointment) {
		throw new BadRequest('Appointment already exists');
	}
	if (!order.prescribery?.questionnaireIds) {
		throw new BadRequest('Questionnaire not found');
	}
	if (!order.prescribery?.patient) {
		throw new BadRequest('Patient not found');
	}

	let reason: string;
	// TODO: upgrade items
	if (order.products) {
		reason = order.products
			.map(
				(orderProduct) =>
					`${orderProduct.product.name}${orderProduct.product.tier === undefined ? '' : ` (Tier ${orderProduct.product.tier})`}`,
			)
			.join(', ');
	} else {
		reason = '';
	}

	const referenceDate = new Date();

	const minutesDifference = Math.abs(
		differenceInMinutes(
			parse(startTime, 'hh:mm a', referenceDate),
			parse(endTime, 'hh:mm a', referenceDate),
		),
	);

	let sourceId: string;
	try {
		sourceId = getProductPrescriberySource(order.products[0].product.id)!;
	} catch {
		sourceId = '';
	}
	const stateRules = await getStateRulesFromOrder(order);

	const appointmentRequest: AppointmentRequest = {
		member_id: memberId,
		patient_id: (order.prescribery.patient.id || order.prescribery.patient.patient_id)!,
		mode: stateRules?.establishingCare === 'videoApptMode' ? 'Video Call' : 'Phone Call',
		repetition: 'Single Date',
		reason,
		start_date: startDate,
		start_time: startTime,
		duration_in_minutes: minutesDifference,
		source_id: Number(sourceId),
	};

	const appointmentId = await postAppointment(appointmentRequest);

	order.prescribery.appointment = {
		type: 'sync',
		startDate,
		startTime,
		endTime,
		memberId,
		appointmentId,
	};

	if (order.products.every((orderProduct) => orderProduct.status !== 'active')) {
		order.status = 'completed';
	}

	await updateOrder(orderId, order, {
		action: 'create_sync_prescribery_appointment',
		...order.prescribery.appointment,
	});
}

export type CreateAsyncAppointmentRequest = {
	order: WithId<Order>;
};

export async function createAsyncAppointment({ order }: CreateAsyncAppointmentRequest) {
	if (order.type !== 'first_time') {
		throw new BadRequest('Order is not a first time order');
	}
	if (order.prescribery?.appointment) {
		throw new BadRequest('Appointment already exists');
	}
	if (!order.prescribery?.questionnaireIds) {
		throw new BadRequest('Questionnaire not found');
	}
	if (!order.prescribery?.patient) {
		throw new BadRequest('Patient not found');
	}

	let reason: string;
	// TODO: upgrade items
	if (order.products) {
		reason = order.products
			.map(
				(orderProduct) =>
					`${orderProduct.product.name}${orderProduct.product.tier === undefined ? '' : ` (Tier ${orderProduct.product.tier})`}`,
			)
			.join(', ');
	} else {
		reason = '';
	}
	let memberId: number | undefined;
	let sourceId: string = '';
	try {
		sourceId = getProductPrescriberySource(order.products[0].product.id)!;
		const members = await getMembers(sourceId);
		memberId = members?.[0]?.member_id;
	} catch {
		memberId = undefined;
	}

	if (memberId === undefined) {
		return false;
	}

	const appointmentRequest: AppointmentRequest = {
		member_id: memberId,
		patient_id: (order.prescribery.patient.id || order.prescribery.patient.patient_id)!,
		mode: 'Video Call',
		repetition: 'Single Date',
		reason,
		source_id: Number(sourceId),
	};

	const appointmentId = await postAppointment(appointmentRequest);

	order.prescribery.appointment = {
		type: 'async',
		memberId,
		appointmentId,
	};

	if (order.products.every((orderProduct) => orderProduct.status !== 'active')) {
		order.status = 'completed';
	}

	await updateOrder(order._id.toString(), order, {
		action: 'create_async_prescribery_appointment',
		appointmentId,
		memberId,
	});

	return true;
}
