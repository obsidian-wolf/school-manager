import { Post, Route, Tags, Body, Security, Request, Path, Put, Delete } from 'tsoa';
import { AuthedRequest } from '../infrastructure/server/middlewares/authentication_middleware';
import {
	createStudent,
	CreateStudentRequest,
	deleteStudent,
	updateParent,
	UpdateParentRequest,
	updateStudent,
	UpdateStudentRequest,
} from '../services/user';
import { ObjectId } from 'mongodb';

@Route('user')
@Tags('User')
export class UserController {
	@Put('/parent/{parentId}')
	@Security('jwt')
	public async updateParent(
		@Request() request: AuthedRequest,
		@Path() parentId: string,
		@Body() requestBody: UpdateParentRequest,
	) {
		return await updateParent(request.user, new ObjectId(parentId), requestBody);
	}

	@Post('/parent/{parentId}/student')
	@Security('jwt')
	public async createStudent(
		@Request() request: AuthedRequest,
		@Path() parentId: string,
		@Body() requestBody: CreateStudentRequest,
	) {
		return await createStudent(request.user, new ObjectId(parentId), requestBody);
	}

	@Put('/parent/{parentId}/student/{studentId}')
	@Security('jwt')
	public async updateStudent(
		@Request() request: AuthedRequest,
		@Path() parentId: string,
		@Path() studentId: string,
		@Body() requestBody: UpdateStudentRequest,
	) {
		return await updateStudent(request.user, new ObjectId(parentId), studentId, requestBody);
	}

	@Delete('/parent/{parentId}/student/{studentId}')
	@Security('jwt')
	public async deleteStudent(
		@Request() request: AuthedRequest,
		@Path() parentId: string,
		@Path() studentId: string,
	) {
		return await deleteStudent(request.user, new ObjectId(parentId), studentId);
	}
}
