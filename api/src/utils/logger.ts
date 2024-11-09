import pino from 'pino';

const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
const isDevelopment = process.env.NODE_ENV !== 'production';
const enablePrettyLogs = process.env.ENABLE_PRETTY_LOGS === 'true' && isDevelopment;

export const logger = pino({
	level,
	depthLimit: 5,
	// Use prettyPrint for development
	transport: enablePrettyLogs
		? {
				target: 'pino-pretty',
				options: {
					colorize: true,
					translateTime: true,
				},
			}
		: undefined,
});
