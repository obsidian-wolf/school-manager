import { ObjectId } from 'mongodb';
import { VoiceflowResponse } from '../integrations/voiceflow/types';

export enum ActorTypes {
	USER = 'User',
	ASSISTANT = 'Assistant',
}

export type Message = {
	actor: ActorTypes;
	parent_text?: string;
	created_at: Date;
	is_deleted: boolean;
	voiceflowResponses?: VoiceflowResponse[];
};

export type Chat = {
	created_at: Date;
	user_id: ObjectId;
	messages: Message[];
};
