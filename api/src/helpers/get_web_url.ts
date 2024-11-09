import config from '../config';

type SuccessErrorType = 'afterpay' | 'nexio';

export function getWebUrl({
	path,
	...request
}:
	| {
			path: '/';
			orderId: string;
	  }
	| {
			path: '/appointment';
			orderId: string;
			type: SuccessErrorType;
	  }
	| {
			path: '/success';
			orderId: string;
			type: SuccessErrorType;
			redirectUrl?: string;
	  }
	| {
			path: '/installment';
			orderId: string;
			installmentId: string;
	  }
	| {
			path: '/error';
			type: SuccessErrorType;
			orderId: string;
			redirectUrl?: string;
	  }) {
	const url = new URL(path, config.WEB_URL);

	for (const key in request) {
		const value = request[key as keyof typeof request];
		if (value !== undefined) {
			url.searchParams.set(key, value);
		}
	}

	return url.href;
}
