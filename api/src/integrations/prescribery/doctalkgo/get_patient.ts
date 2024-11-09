import { format } from 'date-fns';
import { BadRequest } from '../../../infrastructure/common/errors';
import { prescriberyFetch } from './api';

export type Patient = {
	id?: number;
	address_line1: string;
	address_line2?: string;
	blood_group?: string;
	city: string;
	communication_type?: string;
	country: string;
	district?: string;
	dob: string;
	email: string;
	employment_status: string;
	first_name: string;
	gender: string;
	height: string;
	weigh: string;
	identifier: {
		use: string;
		value: string;
	};
	last_name: string;
	mobile: string;
	marital_status: string;
	postal_code: string;
	profile_img: string;
	record_id: string;
	patient_id?: number;
	smoking_status: string;
	state: string;
	status: string;
};

export async function getPatient(email: string, dob: Date) {
	const data = await prescriberyFetch<{
		code: number;
		data: Patient;
	}>(`/patients/search?email=${encodeURIComponent(email)}&dob=${format(dob, 'yyyy-MM-dd')}`, {
		method: 'GET',
	});
	if (!data.data) {
		throw new BadRequest(JSON.stringify(data));
	}
	return data.data;
}
