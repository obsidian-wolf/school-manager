import FormData from 'form-data';
import { callApi } from './api';

export type AppointmentRequest = {
	member_id: number;
	mode: 'Video Call' | 'Phone Call';
	coupon_code?: string;
	is_upgrade?: string;
	start_time?: string; // 05:00 AM
	start_date?: string; // 2024-09-26
	visit_type_id?: string;
	visitor_id?: string;
	visit_id?: string;
	subscription_plan_id?: string;
	referral_code?: string;
	consultation_fee?: string;
	duration_in_minutes?: number;
	repetition: 'Single Date';
	coupon_type?: string;
	patient_id: number;
	start_time_period?: string;
	patient_state?: string;
	coupon_value?: number;
	reason: string;
	message_to_patient?: string;
	timezone?: string;
	frequency?: string;
	video_link?: string;
	source_id: number;
};

export type AppointmentResponse = {
	code: string;
	message: string;
	appointment: {
		appointment_id: number;
	};
};

export async function postAppointment(request: AppointmentRequest) {
	const formData = new FormData();
	formData.append('member_id', request.member_id.toString());
	formData.append('mode', request.mode);
	formData.append('coupon_code', request.coupon_code || '');
	formData.append('is_upgrade', request.is_upgrade || '');
	formData.append('start_time', request.start_time || '');
	formData.append('start_date', request.start_date || '');
	formData.append('visit_type_id', request.visit_type_id || '');
	formData.append('visitor_id', request.visitor_id || '');
	formData.append('visit_id', request.visit_id || '');
	formData.append('subscription_plan_id', request.subscription_plan_id || '');
	formData.append('referral_code', request.referral_code || '');
	formData.append('consultation_fee', request.consultation_fee || '');
	formData.append('duration_in_minutes', request.duration_in_minutes?.toString() || '');
	formData.append('repetition', request.repetition);
	formData.append('coupon_type', request.coupon_type || '');
	formData.append('patient_id', request.patient_id.toString());
	formData.append('start_time_period', request.start_time_period || '');
	formData.append('patient_state', request.patient_state || '');
	formData.append('coupon_value', request.coupon_value?.toString() || '');
	formData.append('reason', request.reason);
	formData.append('message_to_patient', request.message_to_patient || '');
	formData.append('timezone', request.timezone || '');
	formData.append('frequency', request.frequency || '');
	formData.append('video_link', request.video_link || '');
	formData.append('source_id', request.source_id.toString() || '');

	const response = await callApi<AppointmentResponse>({
		url: '/appointments',
		data: formData,
		method: 'POST',
		headers: {
			...formData.getHeaders(), // To properly set the boundaries for multipart data
		},
	});

	return response.appointment.appointment_id;
}
