import { Route, Tags, Get, Request, Security, Query } from 'tsoa';

import { AuthedRequest } from '../infrastructure/server/middlewares/authentication_middleware';
import { getChat } from '../services/chats';

@Route('message')
@Tags('Message')
export class MessageController {
	@Get('/')
	@Security('jwt')
	public async getChat(@Request() request: AuthedRequest, @Query() forceReset?: boolean) {
		return await getChat(request.user, forceReset);
	}
}
