import { ObjectId, WithId } from 'mongodb';
import { BadRequest, Unauthorized } from '../infrastructure/common/errors';
import db from '../infrastructure/db';
import { User } from '../types/parent';
import { teacherCollection } from './teachers';
import {
	randBoolean,
	randFirstName,
	randLastName,
	randNumber,
	randPastDate,
	randPhoneNumber,
} from '@ngneat/falso';
import { times } from '../utils/times';
import { genUuid } from '../utils/gen_uuid';
import { createPamUser } from '../integrations/pam/create_user';
import { updatePamUser } from '../integrations/pam/update_user';
import { deletePamUser } from '../integrations/pam/delete_user';

const userCollection = db.collection<User>('user');

const USER_CACHE: WithId<User>[] = [];

export function parseUser(user: WithId<User>) {
	const { _id, ...res } = user;

	return {
		...res,
		id: _id.toString(),
		students: user.students.map(({ teacher_id, ...res2 }) => ({
			...res2,
			teacher_id: teacher_id.toString(),
		})),
	};
}

export async function getUserFromEmailAndPassword(email: string, password: string) {
	const user = await userCollection.findOne({
		email,
		password,
	});

	if (!user) {
		throw new Unauthorized('Invalid email or password');
	}

	const cachedUser = USER_CACHE.find((user) => user._id.equals(user._id));
	if (!cachedUser) {
		USER_CACHE.push(user);
	}

	return user;
}

export async function getUserFromId(id: ObjectId) {
	const cachedUser = USER_CACHE.find((parent) => parent._id.equals(id));

	if (cachedUser) {
		return cachedUser;
	}

	const user = await userCollection.findOne({
		_id: id,
	});

	if (!user) {
		throw new BadRequest('Parent not found');
	}

	USER_CACHE.push(user);

	return user;
}

export async function getParents(user: WithId<User>) {
	if (user.type !== 'admin') {
		throw new Unauthorized('Only admins can update parents');
	}

	const parents = await userCollection.find().toArray();

	return parents.map(parseUser);
}

export async function deleteParent(user: WithId<User>, parentId: ObjectId) {
	if (user.type !== 'admin') {
		throw new Unauthorized('Only admins can update parents');
	}

	const deletedParent = await userCollection.findOneAndDelete({
		_id: parentId,
	});

	if (!deletedParent) {
		throw new BadRequest('Parent not found');
	}

	try {
		if (deletedParent.pamId) {
			await deletePamUser(deletedParent.pamId);
		}
	} catch {
		//
	}
}

export type CreateParentRequest = {
	name: string;
	email: string;
	surname: string;
	phone: string;
	password: string;
};

export async function createParent(user: WithId<User>, request: CreateParentRequest) {
	if (user.type !== 'admin') {
		throw new Unauthorized('Only admins can update parents');
	}

	const existingParent = await userCollection.findOne({
		$or: [
			{
				email: request.email,
			},
			{
				phone: request.phone,
			},
		],
	});

	if (existingParent) {
		throw new BadRequest('Parent already exists');
	}

	const pamUser = await createPamUser(request);

	const parent: User = {
		name: request.name,
		email: request.email,
		surname: request.surname,
		phone: request.phone,
		password: request.password,
		type: 'parent',
		students: [],
		pamId: pamUser._id,
	};

	const { insertedId } = await userCollection.insertOne(parent);

	const parentWithId = {
		...parent,
		_id: insertedId,
	};

	USER_CACHE.push(parentWithId);

	return parseUser(parentWithId);
}

export type UpdateParentRequest = {
	name: string;
	surname: string;
	phone: string;
};

export async function updateParent(
	user: WithId<User>,
	parentId: ObjectId,
	request: UpdateParentRequest,
) {
	if (user.type !== 'admin') {
		throw new Unauthorized('Only admins can update parents');
	}

	const parent = await userCollection.findOne({
		_id: parentId,
	});

	if (!parent) {
		throw new BadRequest('Parent not found');
	}

	await updatePamUser(parent, request);

	const updatedParent = await userCollection.findOneAndUpdate(
		{
			_id: parent._id,
		},
		{
			$set: {
				name: request.name,
				surname: request.surname,
				phone: request.phone,
			},
		},
	);

	if (!updatedParent) {
		throw new BadRequest('Parent not found');
	}

	const cachedUser = USER_CACHE.find((parent) => parent._id.equals(parent._id));
	if (cachedUser) {
		cachedUser.name = request.name;
		cachedUser.surname = request.surname;
		cachedUser.phone = request.phone;
	} else {
		USER_CACHE.push(updatedParent);
	}

	return parseUser(updatedParent);
}

export type UpdateStudentRequest = {
	name: string;
	surname: string;
	date_of_birth: Date;
	gender: 'Male' | 'Female';
	grade: number;
	teacher_id: string;
};

export async function updateStudent(
	user: WithId<User>,
	parentId: ObjectId,
	studentId: string,
	request: UpdateStudentRequest,
) {
	if (user.type !== 'admin') {
		throw new Unauthorized('Only admins can update parents');
	}

	const parent = await userCollection.findOne({
		_id: parentId,
	});

	if (!parent) {
		throw new BadRequest('Parent not found');
	}

	const existingStudent = parent.students.find((student) => student.id === studentId);

	if (!existingStudent) {
		throw new BadRequest('Student not found');
	}

	const teacher = await teacherCollection.findOne({
		_id: new ObjectId(request.teacher_id),
	});

	if (!teacher) {
		throw new BadRequest('Teacher not found');
	}

	existingStudent.name = request.name;
	existingStudent.surname = request.surname;
	existingStudent.date_of_birth = request.date_of_birth;
	existingStudent.gender = request.gender;
	existingStudent.grade = request.grade;
	existingStudent.teacher_id = new ObjectId(request.teacher_id);

	const updatedParent = await userCollection.findOneAndUpdate(
		{
			_id: parent._id,
		},
		{
			$set: {
				students: parent.students,
			},
		},
	);

	return parseUser(updatedParent!);
}

export type CreateStudentRequest = UpdateStudentRequest;

export async function createStudent(
	user: WithId<User>,
	parentId: ObjectId,
	request: CreateStudentRequest,
) {
	if (user.type !== 'admin') {
		throw new Unauthorized('Only admins can update parents');
	}

	const parent = await userCollection.findOne({
		_id: parentId,
	});

	if (!parent) {
		throw new BadRequest('Parent not found');
	}

	const teacher = await teacherCollection.findOne({
		_id: new ObjectId(request.teacher_id),
	});

	if (!teacher) {
		throw new BadRequest('Teacher not found');
	}

	const student = {
		id: new ObjectId().toHexString(),
		...request,
		teacher_id: new ObjectId(request.teacher_id),
	};

	const updatedParent = await userCollection.findOneAndUpdate(
		{
			_id: parent._id,
		},
		{
			$push: {
				students: student,
			},
		},
	);

	return parseUser(updatedParent!);
}

export async function deleteStudent(user: WithId<User>, parentId: ObjectId, studentId: string) {
	if (user.type !== 'admin') {
		throw new Unauthorized('Only admins can update parents');
	}

	const parent = await userCollection.findOne({
		_id: parentId,
	});

	if (!parent) {
		throw new BadRequest('Parent not found');
	}

	const existingStudent = parent.students.find((student) => student.id === studentId);

	if (!existingStudent) {
		throw new BadRequest('Student not found');
	}

	const updatedParent = await userCollection.findOneAndUpdate(
		{
			_id: parent._id,
		},
		{
			$pull: {
				students: {
					id: studentId,
				},
			},
		},
	);

	return parseUser(updatedParent!);
}

export async function seedParents(teacherIds: ObjectId[]) {
	const parents = await userCollection.find().toArray();

	if (parents.length > 0) {
		return parents.map((p) => p._id);
	}

	const PARENTS: User[] = [
		{
			name: 'CJ',
			surname: 'Visser',
			email: 'cj@mail.com',
			password: 'password!',
			phone: randPhoneNumber(),
			type: 'parent',
			students: times(3, () => ({
				name: randFirstName(),
				id: genUuid(),
				surname: randLastName(),
				date_of_birth: randPastDate(),
				gender: randBoolean() ? 'Female' : 'Male',
				grade: randNumber({ min: 1, max: 12 }),
				teacher_id: teacherIds[randNumber({ min: 0, max: teacherIds.length - 1 })],
			})),
		},
		{
			name: 'CJ',
			surname: 'Visser',
			email: 'cj-admin@mail.com',
			password: 'password!',
			phone: randPhoneNumber(),
			type: 'admin',
			students: [],
		},
		{
			name: 'Peter',
			surname: 'Castleden',
			email: 'peter@mail.com',
			password: 'password!',
			phone: randPhoneNumber(),
			type: 'parent',
			students: times(3, () => ({
				name: randFirstName(),
				id: genUuid(),
				surname: randLastName(),
				date_of_birth: randPastDate(),
				gender: randBoolean() ? 'Female' : 'Male',
				grade: randNumber({ min: 1, max: 12 }),
				teacher_id: teacherIds[randNumber({ min: 0, max: teacherIds.length - 1 })],
			})),
		},
		{
			name: 'Peter',
			surname: 'Castleden',
			email: 'peter-admin@mail.com',
			password: 'password!',
			phone: randPhoneNumber(),
			type: 'admin',
			students: [],
		},
	];

	const res = await userCollection.insertMany(PARENTS);

	return Object.values(res.insertedIds);
}
