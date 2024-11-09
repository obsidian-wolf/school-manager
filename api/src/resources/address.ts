import { z } from 'zod';

import { US_STATE_CODES, USStateCode } from './us_states';
import { User } from './user';

export type Address = Omit<User, 'dob' | 'gender' | 'wp' | 'dealerId'> & {
	// firstName: string;
	// middleName?: string;
	// lastName: string;
	// email: string;
	// phone: string;
	address: string;
	address2?: string;
	city: string;
	postcode: string;
	stateCode: USStateCode;
};

export const AddressSchema = z.object({
	firstName: z.string().min(1, { message: 'First name is required' }),
	middleName: z.string().optional(),
	lastName: z.string().min(1, { message: 'Last name is required' }),
	email: z.string().email(),
	phone: z.string().min(1, { message: 'Phone number is required' }),
	address: z.string().min(1, { message: 'Address is required' }),
	city: z.string().min(1, { message: 'City is required' }),
	postcode: z.string().min(1, { message: 'Postcode is required' }),
	stateCode: z.enum(US_STATE_CODES),
});
