import { ObjectId, WithId } from 'mongodb';
import { BadRequest } from '../infrastructure/common/errors';
import db from '../infrastructure/db';
import { User } from '../types/parent';
import { ActorTypes, Chat, Message } from '../types/chat';
import { vfInteract } from '../integrations/voiceflow/api';

const chatCollection = db.collection<Chat>('chat');

export function parseChat(chat: WithId<Chat>) {
	const { _id, ...res } = chat;

	return {
		...res,
		id: _id.toString(),
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
			return parseChat(chat);
		}
	}

	const newChatId = await chatCollection.insertOne({
		created_at: new Date(),
		user_id: user._id,
		messages: [
			{
				actor: ActorTypes.USER,
				created_at: new Date(),
				is_deleted: false,
			},
		],
	});

	const vfResponses = await vfInteract(
		newChatId.insertedId.toString(),
		{
			type: 'launch',
		},
		{
			parent: {
				id: user._id.toString(),
				name: user.name,
				surname: user.surname,
				email: user.email,
				phone: user.phone,
			},
			students: user.students,
		},
	);

	const updatedChat = await chatCollection.findOneAndUpdate(
		{
			_id: newChatId.insertedId,
		},
		{
			$push: {
				messages: {
					actor: ActorTypes.ASSISTANT,
					created_at: new Date(),
					is_deleted: false,
					voiceflowResponses: vfResponses,
				},
			},
		},
		{
			returnDocument: 'after',
		},
	);

	return parseChat(updatedChat!);
}

export async function sendMessage(parent: WithId<User>, chatId: ObjectId, text: string) {
	const chat = await chatCollection.findOne({
		_id: chatId,
		user_id: parent._id,
	});

	if (!chat) {
		throw new BadRequest('Chat not found');
	}

	const parentMessage: Message = {
		actor: ActorTypes.USER,
		created_at: new Date(),
		is_deleted: false,
		parent_text: text,
	};

	const vfResponses = await vfInteract(chatId.toString(), {
		type: 'text',
		payload: text,
	});

	const updatedChat = await chatCollection.findOneAndUpdate(
		{
			_id: chatId,
		},
		{
			$push: {
				messages: {
					$each: [
						parentMessage,
						{
							actor: ActorTypes.ASSISTANT,
							created_at: new Date(),
							is_deleted: false,
							voiceflowResponses: vfResponses,
						},
					],
				},
			},
		},
		{
			returnDocument: 'after',
		},
	);

	return parseChat(updatedChat!);
}