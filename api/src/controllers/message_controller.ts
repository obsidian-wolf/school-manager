import { Route, Tags, Path, Get, Post, Body, Request, Security } from 'tsoa';

import { AuthedRequest } from '../infrastructure/server/middlewares/authentication_middleware';
import { ObjectId } from 'mongodb';
import { getChat, sendMessage } from '../services/chats';

@Route('message')
@Tags('Message')
export class MessageController {
	@Get('/')
	@Security('jwt')
	public async getChat(@Request() request: AuthedRequest) {
		return await getChat(request.user);
	}

	@Post('/{chatId}')
	@Security('jwt')
	public async sendMessage(
		@Request() request: AuthedRequest,
		@Path() chatId: string,
		@Body() text: string,
	) {
		return await sendMessage(request.user, new ObjectId(chatId), text);
	}
}
