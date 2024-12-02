import db from '../infrastructure/db';
import { times } from '../utils/times';
import { randFirstName, randLastName } from '@ngneat/falso';
import { Teacher } from '../types/teacher';

export const teacherCollection = db.collection<Teacher>('teacher');

export async function seedTeachers() {
	const teachers = await teacherCollection.find().toArray();

	if (teachers.length > 0) {
		return teachers.map((t) => t._id);
	}

	const TEACHERS: Teacher[] = times(20, () => ({
		name: randFirstName(),
		surname: randLastName(),
	}));

	const res = await teacherCollection.insertMany(TEACHERS);

	return Object.values(res.insertedIds);
}
