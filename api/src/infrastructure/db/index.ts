/**
 * The following is required to hook up the db client at startup.
 */
import { client, db } from './client';

export async function connect() {
	try {
		await client.connect();
		console.log('Connected successfully to database');
	} catch (e) {
		console.error(e);
		throw e;
	}
}

export default db;
