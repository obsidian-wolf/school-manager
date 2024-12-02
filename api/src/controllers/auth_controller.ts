import { Route, Tags, Post, Body } from 'tsoa';

import { login } from '../auth';

@Route('auth')
@Tags('Auth')
export class AuthController {
	@Post('/login')
	public async login(@Body() request: { email: string; password: string }) {
		const SCHOOL_ID = '6724cd433072a8be299591d1';
		const SCHOOL_PASSWORD = '$choo!';
		const pamToken = Buffer.from(`${SCHOOL_ID}:${SCHOOL_PASSWORD}`).toString('base64');

		const { user, jwt } = await login(request.email, request.password);

		return {
			jwt,
			pam_token: user.type === 'admin' ? pamToken : undefined,
		};
	}
}
