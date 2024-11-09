import axios, { AxiosError } from 'axios';
import safeStringify from 'fast-safe-stringify';
import { logger } from '../utils/logger';

const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(
	(config) => {
		// Log the outgoing request at debug level
		logger.debug({ req: config }, 'Starting Axios request');
		return config;
	},
	(error) => {
		// Do not log the error here; let the error middleware handle it
		return Promise.reject(error);
	},
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
	(response) => {
		// Log the response at debug level
		logger.debug({ res: response }, 'Axios response received');
		return response;
	},
	(error: AxiosError) => {
		// Do not log the error here; let the error middleware handle it
		return Promise.reject(error);
	},
);

interface AxiosErrorResponse {
	status?: number;
	message: string;
	data?: any;
}

export function parseError(error: unknown) {
	if (axios.isAxiosError(error)) {
		const axiosError = error as AxiosError;

		return {
			status: axiosError.response?.status,
			message: axiosError.message,
			data: axiosError.response?.data,
		} as AxiosErrorResponse;
	}

	if (typeof (error as any)?.message === 'string') {
		return {
			message: (error as any).message,
			stack: (error as any).stack,
		};
	}
	try {
		return JSON.parse(safeStringify(error));
	} catch {
		// Handle non-Axios errors, if necessary
		return {
			message: 'An unexpected error occurred',
		};
	}
}

export default axiosInstance;
