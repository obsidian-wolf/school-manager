import { Route, Tags, Path, Get, Post, Body, Request, Security, Query } from 'tsoa';

import { AuthedRequest } from '../infrastructure/server/middlewares/authentication_middleware';
import { ObjectId } from 'mongodb';
import { getChat, sendMessage } from '../services/chats';

type TextBody = {
	text: string;
};

@Route('message')
@Tags('Message')
export class MessageController {
	@Get('/')
	@Security('jwt')
	public async getChat(@Request() request: AuthedRequest, @Query() forceReset?: boolean) {
		return await getChat(request.user, forceReset);
	}

	@Post('/{chatId}')
	@Security('jwt')
	public async sendMessage(
		@Request() request: AuthedRequest,
		@Path() chatId: string,
		@Body() body: TextBody,
	) {
		return await sendMessage(request.user, new ObjectId(chatId), body.text);
	}
}
