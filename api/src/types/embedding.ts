import { ObjectId } from 'mongodb';

export type Embedding = {
	pam_id: string;
	user_id: ObjectId;
	summary?: string;
	is_pending?: boolean;
};
