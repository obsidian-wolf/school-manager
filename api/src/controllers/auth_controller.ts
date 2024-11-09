import { Post, Route, Tags, Request, Put, Body, Security, Get, Query } from 'tsoa';
import express from 'express';

import { AdminLoginRequest } from '../auth/types';
import { adminLogin } from '../auth';
import { processSubmissions } from '../orders/trinity/process_submissions';
import { getWp } from '../integrations/wordpress';
import { getPatient } from '../integrations/prescribery/doctalkgo/get_patient';

@Route('auth')
@Tags('Auth')
export class AuthController {
	@Put('/admin-login')
	public async adminLogin(
		@Request() req: express.Request,
		@Body() requestBody: AdminLoginRequest,
	) {
		return await adminLogin(req.res, requestBody);
	}

	@Post('/test')
	@Security('jwt')
	public async test() {
		return true;
	}

	@Get('/trinity-submissions')
	@Security('jwt')
	public async processSubmissions(@Query() preview: boolean = true) {
		return await processSubmissions(preview);
	}

	@Get('/demo')
	@Security('jwt')
	public async demo(@Query() email: string, @Query() dob: Date) {
		const wpUser = await getWp(email);
		const prescribery = await getPatient(email, dob);
		return {
			wpUser,
			prescribery,
		};
	}
}
