// TODO move to config.ts
const VERSION_ID = '66d43121ff6d871c846b1580';
const AUTH = 'VF.DM.66da082416a91c9f126faa80.H4srexGzO28mpIi4';

import axios from 'axios';
import { StartupVariables, VoiceflowRequest, VoiceflowResponse } from './types';

export const api = axios.create({
	baseURL: 'https://general-runtime.voiceflow.com',
	params: { logs: 'off' },
	headers: {
		accept: 'application/json',
		'content-type': 'application/json',
		versionID: VERSION_ID,
		Authorization: AUTH,
	},
});

export async function vfInteract(
	chatId: string,
	action: VoiceflowRequest,
	variables?: StartupVariables,
) {
	const response = await api.post(`/state/user/${chatId}/interact`, {
		action,
		state: {
			variables,
		},
		config: {
			tts: false,
			stripSSML: true,
			stopAll: true,
			excludeTypes: ['block', 'debug', 'flow'],
		},
	});
	const { data } = response;
	if (!data || data.length === 0) {
		return [];
	}
	const responseData = data as VoiceflowResponse[];
	if (responseData.length === 0) {
		return [data as VoiceflowResponse]; // Sometimes the response is not an array :/
	}
	return responseData;
}

export async function vfUpdateVariables(chatId: string, variables: any) {
	const response = await api.patch(`/state/user/${chatId}/variables`, {
		...variables,
	});
	const { data } = response;
	if (!data || data.length === 0) {
		return [];
	}
	const responseData = data as VoiceflowResponse[];
	if (responseData.length === 0) {
		return [data as VoiceflowResponse]; // Sometimes the response is not an array :/
	}
	return responseData;
}
