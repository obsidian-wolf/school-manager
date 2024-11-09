import FormData from 'form-data';
import { Patient } from './get_patient';
import { BadRequest } from '../../../infrastructure/common/errors';
import { callApi, prescriberyFetch } from './api';

export type CreatePatientRequest = {
	first_name: string;
	last_name: string;
	email: string;
	dob: string; // You might want to use a more specific Date type, depending on the format
	gender: string;
	postal_code?: string;
	mobile: string;
	// create_contact_on?: string[]; // Assuming it's an array of strings
	city?: string;
	state?: string;
	address_line1?: string;
	address_line2?: string;
	welcome_email?: boolean;
};

export async function TEST_createPatient() {
	const requestBody: CreatePatientRequest = {
		postal_code: '94301', // Empty for now, replace with actual data
		gender: 'Male',
		mobile: '+447443084534', // Empty for now, replace with actual data
		// create_contact_on: [''], // Array of empty values for now
		city: 'Palo Alto', // Empty for now
		state: 'California', // Empty for now
		address_line1: '1631 Cowper Street', // Empty for now
		address_line2: '', // Empty for now
		last_name: 'Visser',
		dob: '1992-11-06', // Replace with actual date string or Date type if required
		first_name: 'Christiaan',
		email: 'cj+0@elliemd.com',
		welcome_email: false, // Empty for now
	};
	try {
		const response = await createPatient(requestBody);
		console.log(response);
		return response;
	} catch (error) {
		console.error(error);
	}
}

export async function createPatient(request: CreatePatientRequest) {
	const formData = new FormData();

	formData.append('postal_code', request.postal_code || '');
	formData.append('gender', request.gender || '');
	formData.append('mobile', request.mobile || '');
	formData.append('city', request.city || '');
	formData.append('state', request.state || '');
	formData.append('address_line1', request.address_line1 || '');
	formData.append('address_line2', request.address_line2 || '');
	formData.append('last_name', request.last_name || '');
	formData.append('dob', request.dob || '');
	formData.append('first_name', request.first_name || '');
	formData.append('email', request.email || '');
	formData.append('welcome_email', request.welcome_email ? 'true' : 'false');

	const data = await callApi<PatientResponse>({
		url: '/patients',
		data: formData,
		method: 'POST',
		headers: {
			...formData.getHeaders(), // To properly set the boundaries for multipart data
		},
	});
	if (!data.patient) {
		throw new BadRequest(JSON.stringify(data));
	}
	return data.patient;
}

export async function getPatient(request: CreatePatientRequest) {
	const formData = new FormData();

	formData.append('postal_code', request.postal_code || '');
	formData.append('gender', request.gender || '');
	formData.append('mobile', request.mobile || '');
	formData.append('city', request.city || '');
	formData.append('state', request.state || '');
	formData.append('address_line1', request.address_line1 || '');
	formData.append('address_line2', request.address_line2 || '');
	formData.append('last_name', request.last_name || '');
	formData.append('dob', request.dob || '');
	formData.append('first_name', request.first_name || '');
	formData.append('email', request.email || '');
	formData.append('welcome_email', request.welcome_email ? 'true' : 'false');

	const data = await prescriberyFetch<PatientResponse>('/patients', {
		body: formData,
		method: 'POST',
	});
	if (!data.patient) {
		throw new BadRequest(JSON.stringify(data));
	}
	return data.patient;
}

export type PatientResponse = {
	code: number;
	patient?: Patient;
};

// 3958
