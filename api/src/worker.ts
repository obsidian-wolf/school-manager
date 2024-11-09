import { Agenda } from '@hokify/agenda';
import config from './config';
import { processSubmissions } from './orders/trinity/process_submissions';

const agenda = new Agenda({ db: { address: config.DATABASE_URL }, ensureIndex: true });

agenda.on('ready', async () => {
	console.log('Agenda is ready!');
});

agenda.define('process reminders', async () => {
	console.log('Processing payments...');
	try {
		const result = await processSubmissions();
		console.log('Processed payments', result);
	} catch (err) {
		console.error('Error processing payments', err);
	}
});

(async function () {
	await agenda.start();
	await agenda.every('*/10 * * * *', 'process reminders @ ' + new Date());
})();

async function graceful() {
	console.log('Agenda stopping!');
	await agenda.stop();
	process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);
