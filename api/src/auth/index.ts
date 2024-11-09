import { BadRequest } from '../infrastructure/common/errors';
import * as jwt from 'jsonwebtoken';
import express from 'express';

import config from '../config';
import { AdminLoginRequest } from './types';

type JwtUser = {
	id: string;
};

export const ADMIN_USERS =
	config.APP_URL !== 'https://app.elliemd.com'
		? [
				{
					id: '22799043442681045',
					password: '4937118545634',
					scope: 'prescribery',
				},
				{
					id: '1367798493845',
					password: '1238771209012',
					scope: 'admin',
				},
			]
		: [
				{
					id: '34426812279904045',
					password: '1854564937134',
					scope: 'prescribery',
				},
				{
					id: '4938136779845',
					password: '1209123877012',
					scope: 'admin',
				},
			];

const encodeJwt = (user: JwtUser, secret: string) => jwt.sign(user, secret);

function decodeJwt(token: string | undefined, secret: string): JwtUser | undefined {
	if (!token) return undefined;
	try {
		const decodedJwt = jwt.verify(token, secret);
		if (!decodedJwt) return undefined;
		return decodedJwt as JwtUser;
	} catch {
		return undefined;
	}
}

export function decodeJwtFromHeader(req: express.Request) {
	const token = req.headers?.authorization as string | undefined;
	return decodeJwt(token, config.JWT_SECRET);
}

export async function adminLogin(
	res: express.Request['res'],
	request: AdminLoginRequest,
): Promise<string> {
	const user = ADMIN_USERS.find(
		(user) => user.id === request.id && user.password === request.password,
	);

	if (!user) {
		throw new BadRequest('Invalid id or password');
	}

	const jwtUser: JwtUser = {
		id: user.id,
	};

	const headerToken = encodeJwt(jwtUser, config.JWT_SECRET);

	return headerToken;
}
