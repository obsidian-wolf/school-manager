import { Route, Tags, Post, Body } from 'tsoa';

import { login } from '../auth';
import { pamToken } from '../integrations/pam';

@Route('auth')
@Tags('Auth')
export class AuthController {
	@Post('/login')
	public async login(@Body() request: { email: string; password: string }) {
		const { user, jwt } = await login(request.email, request.password);

		return {
			jwt,
			pam_token: user.type === 'admin' ? pamToken : undefined,
		};
	}
}
