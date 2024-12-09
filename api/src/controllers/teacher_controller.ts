import { Route, Tags, Security, Request, Get } from 'tsoa';
import { AuthedRequest } from '../infrastructure/server/middlewares/authentication_middleware';

import { getTeachers } from '../services/teacher';

@Route('teacher')
@Tags('Teacher')
export class TeacherController {
	@Get('/')
	@Security('jwt')
	public async getTeachers(@Request() request: AuthedRequest) {
		return await getTeachers(request.user);
	}
}
