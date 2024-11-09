import { BadRequest } from '../../../../infrastructure/common/errors';
import {
	AvailableSlots,
	getAvailableSlots,
} from '../../../../integrations/prescribery/doctalkgo/available_slots';
import { getOrder, updateOrder } from '../../../collection';
import { Order } from '../../../types';
import { getProductPrescriberySource } from '../../../../resources/products';
import { US_STATES } from '../../../../resources/us_states';
import { sendMessage } from '../../../../integrations/slack/send_message';

export async function getSlotsForOrder(order: Order) {
	if (order.type !== 'first_time') {
		throw new BadRequest('Only first time orders can have appointments');
	}
	if (order.prescribery?.isSync === false) {
		return undefined;
	}
	const state =
		US_STATES.find(
			(u) =>
				u.value.toLocaleLowerCase().trim() ===
				order.personalInfo.billing.stateCode.toLocaleLowerCase().trim(),
		)?.label || order.personalInfo.billing.stateCode.toLocaleLowerCase().trim();

	const sourceId = getProductPrescriberySource(order.products[0].product.id)!;

	try {
		return await getAvailableSlots(sourceId, state);
	} catch {
		return undefined;
	}
}

export async function getAppointments(orderId: string) {
	const order = await getOrder(orderId);

	if (order.type !== 'first_time') {
		throw new BadRequest('Only first time orders can have appointments');
	}

	if (!order.prescribery?.questionnaireIds) {
		throw new BadRequest('No questionnaireIds found in order');
	}

	const slots = await getSlotsForOrder(order);

	if (!slots || Object.keys(slots).length === 0) {
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
	return slots || ({} as AvailableSlots);
}
