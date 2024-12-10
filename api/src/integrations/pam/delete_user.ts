import { api } from '.';

export async function deletePamUser(pamId: string) {
	await api.delete(`/user?userId=${pamId}`);
}
