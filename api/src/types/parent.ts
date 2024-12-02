import { ObjectId } from 'mongodb';

export type Student = {
	id: string;
	name: string;
	surname: string;
	date_of_birth: Date;
	gender: 'Male' | 'Female';
	grade: number;
	teacher_id: ObjectId;
};

export type User = {
	name: string;
	surname: string;
	email: string;
	phone: string;
	password: string;
	students: Student[];
	type: 'admin' | 'parent';
};
