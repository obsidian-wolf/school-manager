export class BadRequest extends Error {
	public name = 'BadRequest';

	constructor(message: string, ...details: any) {
		super(message);
		(this as any).details = details;
	}
}

export class NotFound extends Error {
	public name = 'NotFound';

	constructor(message: string, ...details: any) {
		super(message);
		(this as any).details = details;
	}
}

export class InvalidArgument extends Error {
	public name = 'InvalidArgument';

	constructor(message: string, ...details: any) {
		super(message);
		(this as any).details = details;
	}
}

export class Unauthorized extends Error {
	public name = 'Unauthorized';

	constructor(message: string, ...details: any) {
		super(message);
		(this as any).details = details;
	}
}

export class Forbidden extends Error {
	public name = 'Forbidden';
}
