import { WithId } from 'mongodb';
import db from '../infrastructure/db';
import { User } from '../types/parent';
import { ActorTypes, Chat } from '../types/chat';
import { pamToken } from '../integrations/pam';

const chatCollection = db.collection<Chat>('chat');

export function parseChat(chat: WithId<Chat>, user: WithId<User>) {
	const { _id, ...res } = chat;

	return {
		chat: {
			...res,
			id: _id.toString(),
		},
		startupVariables: {
			debug_ind: 0,
			parent: {
				id: user.pamId,
				name: user.name,
				surname: user.surname,
				email: user.email,
				phone: user.phone,
			},
			students: user.students,
			api_token: `Basic ${pamToken}`,
		},
	};
}

export async function getChat(user: WithId<User>, forceReset = false) {
	if (!forceReset) {
		const chat = await chatCollection.findOne(
			{
				user_id: user._id,
			},
			{
				sort: {
					created_at: -1,
				},
			},
		);

		if (chat) {
			return parseChat(chat, user);
		}
	}

	const newChat: Chat = {
		created_at: new Date(),
		user_id: user._id,
		messages: [
			{
				actor: ActorTypes.USER,
				created_at: new Date(),
				is_deleted: false,
			},
		],
	};

	const { insertedId: newChatId } = await chatCollection.insertOne(newChat);

	const newChatWithId: WithId<Chat> = {
		...newChat,
		_id: newChatId,
	};

	return parseChat(newChatWithId, user);
}
