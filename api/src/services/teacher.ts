import { WithId } from 'mongodb';
import { Unauthorized } from '../infrastructure/common/errors';
import { User } from '../types/parent';
import { teacherCollection } from './teachers';

export async function getTeachers(user: WithId<User>) {
	if (user.type !== 'admin') {
		throw new Unauthorized('Only admins can update parents');
	}

	const teachers = await teacherCollection.find().toArray();

	return teachers.map(({ _id, ...res }) => ({
		...res,
		id: _id.toString(),
	}));
}
