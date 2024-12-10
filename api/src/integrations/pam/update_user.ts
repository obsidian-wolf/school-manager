import { WithId } from 'mongodb';
import { api } from '.';
import { UpdateParentRequest } from '../../services/user';
import { CreatePamUserRequest, CreatePamUserResponse } from './create_user';
import { User } from '../../types/parent';

type UpdatePamUserRequest = CreatePamUserRequest;

type UpdatePamUserResponse = CreatePamUserResponse;

export async function updatePamUser(existingParent: WithId<User>, parent: UpdateParentRequest) {
	if (!existingParent.pamId) {
		return;
	}
	const request: UpdatePamUserRequest = {
		contact_info: {
			email: existingParent.email,
			phone_number: parent.phone,
		},
		first_name: parent.name,
		password: existingParent.password,
		surname: parent.surname,
	};

	const { data } = await api.put<UpdatePamUserResponse>(
		`/user?userId=${existingParent.pamId}`,
		request,
	);

	return data;
}
