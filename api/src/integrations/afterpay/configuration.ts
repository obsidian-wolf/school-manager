import { api } from '.';

export type Configuration = {
	minimumAmount: {
		amount: string;
		currency: string;
	};
	maximumAmount: {
		amount: string;
		currency: string;
	};
};

// https://developers.afterpay.com/docs/api/reference/configuration/operations/get-a-v-2-configuration
export async function getConfiguration() {
	return await api.get<Configuration>('/v2/configuration');
}
