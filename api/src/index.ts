import { start as startServer } from './infrastructure/server';
import { connect as connectDatabase } from './infrastructure/db';
import config from './config';

/**
 * The entrypoint of the api.
 */
async function main(): Promise<void> {
	try {
		await connectDatabase();
		await startServer(Number(config.PORT));
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {
		process.exit(1);
	}
}

main();
