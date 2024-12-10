import { api } from '.';
import { CreateParentRequest } from '../../services/user';

export type CreatePamUserRequest = {
	contact_info: {
		email?: string;
		phone_number: string;
	};
	first_name?: string;
	password?: string;
	surname?: string;
	user_name?: string;
	user_persona?: unknown;
	[key: string]: unknown;
};

export type CreatePamUserResponse = CreatePamUserRequest & {
	type: 'whatsapp' | 'api';
	is_admin: boolean;
	parent_id: string;
	_id: string;
};

export async function createPamUser(parent: CreateParentRequest) {
	const request: CreatePamUserRequest = {
		contact_info: {
			email: parent.email,
			phone_number: parent.phone,
		},
		first_name: parent.name,
		password: parent.password,
		surname: parent.surname,
	};

	const { data } = await api.post<CreatePamUserResponse>('/user', request);

	return data;
}
