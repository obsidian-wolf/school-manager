import axios from 'axios';
import config from '../../config';
import { getFormidableUser, ParsedFormidableUser } from './get_formidable_user';
import { User } from '../../resources/user';
import { Address } from '../../resources/address';
import { deepCopy } from '../../utils/deep_copy';
import { BadRequest } from '../../infrastructure/common/errors';
import { PersonalInfo } from '../../resources/personal_info';
import { getUser, WPUser } from './get_user';
import {
	freeSearchPatients,
	getPatients,
	SearchPatient,
} from '../prescribery/doctalkgo/get_patients';
import { US_STATES } from '../../resources/us_states';

const AUTH_DECODED = `${config.WP_EMAIL}:${config.WP_PASSWORD}`;

const AUTH_TOKEN = Buffer.from(AUTH_DECODED).toString('base64');

export const api = axios.create({
	baseURL: config.WP_URL,
	headers: {
		Authorization: `Basic ${AUTH_TOKEN}`,
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

export type Wp = {
	formidableUser?: ParsedFormidableUser;
	user?: WPUser;
};

export async function getWp(userEmail: string): Promise<Wp> {
	const [formidableUser, user] = await Promise.all([
		getFormidableUser(userEmail),
		getUser(userEmail),
	]);

	return { formidableUser, user };
}

export async function getPersonalInfoFromWp(userEmail: string): Promise<PersonalInfo> {
	const wp = await getWp(userEmail);

	if (!wp.user) {
		throw new BadRequest('WordPress user not found');
	}
	let prescriberyPatient: SearchPatient | undefined = undefined;
	if (!wp.formidableUser) {
		try {
			const freeSearchPatientsData = await freeSearchPatients(userEmail);
			const freeSearchPatient = freeSearchPatientsData[0];

			if (freeSearchPatient) {
				const patientsData = await getPatients({
					page: 1,
					recordId: freeSearchPatient.record_id,
				});
				prescriberyPatient = patientsData.patients[0];
			}
		} catch {
			//
		}
	}
	if (!wp.formidableUser && !prescriberyPatient) {
		throw new BadRequest('Patient not found in Formidable or Prescribery');
	}

	let dealerId = Number(wp.user.meta!.dealer_id);
	if (!dealerId || isNaN(dealerId)) {
		dealerId = 0;
	}

	const user: User = {
		prescriberyPatient,
		wp,
		dealerId,
		firstName: wp.formidableUser?.first_name || prescriberyPatient?.first_name || '',
		middleName: wp.formidableUser?.middle_name || '',
		lastName: wp.formidableUser?.last_name || prescriberyPatient?.last_name || '',
		email: userEmail,
		phone: wp.formidableUser?.phone || prescriberyPatient?.mobile || '',
		dob: wp.formidableUser?.dob || new Date(prescriberyPatient!.dob),
		gender:
			wp.formidableUser?.gender ||
			(prescriberyPatient?.gender === 'male' ? 'Male' : 'Female'),
	};

	const shipping: Address = {
		firstName: user.firstName,
		middleName: user.middleName,
		lastName: user.lastName,
		email: user.email,
		phone: user.phone,

		address: wp.formidableUser?.address || '',
		address2: wp.formidableUser?.address2,
		city: wp.formidableUser?.city || prescriberyPatient?.city || '',
		postcode: wp.formidableUser?.postcode || prescriberyPatient?.zip_code || '',
		stateCode:
			wp.formidableUser?.stateCode ||
			((prescriberyPatient?.state &&
				US_STATES.find((u) => u.value === prescriberyPatient.state)?.label) as any),
	};
	return {
		user,
		shipping,
		billing: deepCopy(shipping),
	};
}
