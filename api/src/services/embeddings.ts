import { WithId } from 'mongodb';
import { User } from '../types/parent';
import db from '../infrastructure/db';
import { Embedding } from '../types/embedding';

const embeddingCollection = db.collection<Embedding>('embedding');

export async function saveSummary(user: WithId<User>, id: string, summary: string) {
	const embedding = await embeddingCollection.findOne({ user_id: user._id, pam_id: id });

	if (!embedding) {
		await embeddingCollection.insertOne({ user_id: user._id, pam_id: id, summary });
		return;
	}

	await embeddingCollection.updateOne({ user_id: user._id, pam_id: id }, { $set: { summary } });
}

export type WebEmbedding = Omit<Embedding, '_id'>;

export async function saveEmbedding(user: WithId<User>, id: string, isPending = true) {
	await embeddingCollection.insertOne({ user_id: user._id, pam_id: id, is_pending: isPending });
}

export async function getEmbeddings(user: WithId<User>): Promise<WebEmbedding[]> {
	const embeddings = await embeddingCollection.find({ user_id: user._id }).toArray();

	return embeddings.map((embedding) => {
		const { _id, ...rest } = embedding;
		return { id: _id.toString(), ...rest };
	});
}

export async function deleteEmbedding(user: WithId<User>, id: string) {
	await embeddingCollection.deleteOne({ user_id: user._id, pam_id: id });
}

export type SetEmbeddedStatus = {
	id: string;
	status: 'embedded';
};

export async function setEmbeddedStatus(embeddedStatus: SetEmbeddedStatus) {
	await embeddingCollection.updateOne(
		{ pam_id: embeddedStatus.id },
		{ $set: { is_pending: false } },
	);
}
