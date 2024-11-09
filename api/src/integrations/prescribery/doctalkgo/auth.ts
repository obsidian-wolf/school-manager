import { addSeconds } from 'date-fns';
import config from '../../../config';
import { urlJoin } from '../../../utils/join_url';

type AccessToken = {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	expires_at?: number;
};

let CACHED_ACCESS_TOKEN: AccessToken | null = null;

export async function clearAccessToken() {
	CACHED_ACCESS_TOKEN = null;
}

export async function getAccessToken() {
	// get cached access token if it exists and is not expired (give 10 seconds buffer)
	if (
		CACHED_ACCESS_TOKEN &&
		CACHED_ACCESS_TOKEN.expires_at &&
		CACHED_ACCESS_TOKEN.expires_at > Date.now() + 10000
	) {
		return CACHED_ACCESS_TOKEN;
	}

	try {
		const fullUrl = urlJoin(config.PRESCRIBERY_API_URL, '/access-token');

		const response = await fetch(fullUrl, {
			method: 'POST',
			body: `api_key=${config.PRESCRIBERY_API_TOKEN}`,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

		if (!response.ok) {
			throw new Error(await response.text());
		}

		const data = (await response.json()) as AccessToken;

		CACHED_ACCESS_TOKEN = data;
		CACHED_ACCESS_TOKEN!.expires_at = addSeconds(new Date(), data.expires_in).getTime();
		return data;
	} catch (error) {
		CACHED_ACCESS_TOKEN = null;
		throw error;
	}
}
