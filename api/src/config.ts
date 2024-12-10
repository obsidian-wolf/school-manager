const CONFIG = {
	DATABASE_URL: true,
	JWT_SECRET: true,
	PORT: true,
	PAM_URL: true,
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
