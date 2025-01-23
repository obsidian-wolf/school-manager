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
	pamId?: string;
};

export type User = {
	// PAM properties
	user_persona: string;
	contact_info: {
		phone_number: string;
		email: string;
	};
	surname: string;
	first_name: string;
	user_name: string;

	// School properties

	// Don't confuse with PAM password.  This is to login to the school's system.
	school_password: string;
	school_students: {
		id: string;
		name: string;
		surname: string;
		date_of_birth: Date;
		gender: 'Male' | 'Female';
		grade: number;
		teacher_id: ObjectId;
	}[];
	school_type: 'admin' | 'parent';
};
