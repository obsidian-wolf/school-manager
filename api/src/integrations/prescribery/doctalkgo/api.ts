import config from '../../../config';
import { clearAccessToken, getAccessToken } from './auth';
import { urlJoin } from '../../../utils/join_url';
import axios, { AxiosRequestConfig } from 'axios';

export async function prescriberyFetch<T = any>(
	url: string,
	options: RequestInit = {},
	refreshToken = true,
) {
	// safely join url with base url
	const fullUrl = urlJoin(config.PRESCRIBERY_API_URL, url);

	try {
		const response = await fetch(fullUrl, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				...(options.headers || {}),
				Authorization: `Bearer ${(await getAccessToken()).access_token}`,
			},
		});
		// if 401
		if (refreshToken && response.status === 401) {
			clearAccessToken();
			return prescriberyFetch<T>(url, options, false);
		}
		if (!response.ok) {
			throw new Error(await response.text());
		}
		return (await response.json()) as T;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

/**
 https://staging.doctalkgo.com/api/dtg/v1/patients/search?email=cj%2B4%40elliemd.com&dob=1984-01-05
 */

export const api = axios.create({
	baseURL: config.PRESCRIBERY_API_URL,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});

export async function callApi<T = any>(request: AxiosRequestConfig, refreshToken = true) {
	const token = await getAccessToken();

	try {
		const response = await api.request<T>({
			...request,
			headers: {
				...request.headers,
				Authorization: `Bearer ${token.access_token}`,
			},
		});

		return response.data;
	} catch (error) {
		// if unauthorized, refresh token and retry
		if (refreshToken && (error as any)?.response?.status === 401) {
			clearAccessToken();
			return callApi<T>(request, false);
		} else {
			throw error;
		}
	}
}
