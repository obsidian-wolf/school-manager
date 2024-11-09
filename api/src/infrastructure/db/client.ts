import { MongoClient } from 'mongodb';
import config from '../../config';

const dbName = 'school_manager';

export const client = new MongoClient(config.DATABASE_URL);

export const db = client.db(dbName);
