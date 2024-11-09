const CONFIG = {
	AFTERPAY_MERCHANT_ID: true,
	AFTERPAY_SECRET: true,
	AFTERPAY_URL: true,
	APP_URL: true,
	DATABASE_URL: true,
	JWT_SECRET: true,
	NEXIO_EMAIL: true,
	NEXIO_PASSWORD: true,
	NEXIO_URL: true,
	NODE_ENV: true,
	PRESCRIBERY_API_TOKEN: true,
	PRESCRIBERY_API_URL: true,
	PRESCRIBERY_URL: true,
	PORT: true,
	QUOTAGUARDSHIELD_URL: false,
	SLACK_CHANNEL: false,
	SLACK_OAUTH_TOKEN: false,

	TRINITY_CONTEXT: false,
	TRINITY_TOKEN: false,
	TRINITY_URL: false,
	WEB_URL: true,
	WP_EMAIL: true,
	WP_PASSWORD: true,
	WP_URL: true,
} as const;

type Config = {
	[K in keyof typeof CONFIG]: (typeof CONFIG)[K] extends true ? string : string | undefined;
};

const config = Object.entries(CONFIG).reduce<Config>((acc, [key, isRequired]) => {
	if (isRequired && !process.env[key]) {
		console.warn(`Missing environment variable ${key}`);
	}
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	acc[key] = process.env[key] as string;
	return acc;
}, {} as Config);

export default config;
