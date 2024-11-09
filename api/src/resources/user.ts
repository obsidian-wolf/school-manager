import { z } from 'zod';
import { Wp } from '../integrations/wordpress';
import { deepCopy } from '../utils/deep_copy';
import { Address } from './address';
import { USStateCode } from './us_states';
import { SearchPatient } from '../integrations/prescribery/doctalkgo/get_patients';

export type User = {
	prescriberyPatient?: SearchPatient;
	wp: Wp;
	firstName: string;
	middleName?: string;
	lastName: string;
	email: string;
	dealerId: number;
	dob: Date;
	gender: string;
	// address?: string; // cfylh
	// city?: string; // otbq6
	// postcode?: string; // xiruv
	// state?: string; // state_name
	// stateCode?: string; // state_name-value
	phone: string; // 5zv3z
};

export const UserSchema = z.object({
	firstName: z.string().min(1, { message: 'First name is required' }),
	middleName: z.string().optional(),
	lastName: z.string().min(1, { message: 'Last name is required' }),
	email: z.string().email(),
	phone: z.string().min(1, { message: 'Phone number is required' }),
	dob: z.date(),
});

export function getDefaultAddress(user: User) {
	const duplicateUser = deepCopy<User>(user);

	const address: Address = {
		...duplicateUser,
		address: duplicateUser.wp?.formidableUser?.address || '',
		city: duplicateUser.wp?.formidableUser?.city || '',
		postcode: duplicateUser.wp?.formidableUser?.postcode || '',
		stateCode: (duplicateUser.wp?.formidableUser?.stateCode || '') as USStateCode,
	};
	return address;
}
