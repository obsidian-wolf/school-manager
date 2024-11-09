import { Address } from './address';
import { User } from './user';

export type PersonalInfo = {
	billing: Address;
	shipping: Address;
	user: User;
};
