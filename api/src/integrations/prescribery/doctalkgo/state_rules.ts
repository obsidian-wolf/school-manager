import { addHours } from 'date-fns';
import { prescriberyFetch } from './api';

export type StateRule = {
	establishingCare: 'phoneApptMode' | 'asyncApptMode' | 'videoApptMode';
	continuedCare: 'phoneApptMode' | 'asyncApptMode' | 'videoApptMode';
};

export type StateRuleResponse = {
	code: 200;
	message: 'success';
	data: StateRule;
};

const CACHED_STATE_RULES: Record<
	string,
	{
		expires_at?: number;
		stateRule: StateRule;
	}
> = {};

export async function getStateRules(sourceId: string, state: string) {
	const cached = CACHED_STATE_RULES[state];
	if (cached && cached.expires_at && cached.expires_at > Date.now() + 10000) {
		return cached.stateRule;
	}
	const params = new URLSearchParams({
		source_id: sourceId,
		state_name: state,
	});
	const response = await prescriberyFetch<StateRuleResponse>(`/staterule?${params.toString()}`);
	CACHED_STATE_RULES[state] = {
		stateRule: response.data,
		expires_at: addHours(new Date(), 1).getTime(),
	};

	return response.data;
}
