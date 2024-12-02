import * as jwt from 'jsonwebtoken';
import express from 'express';

import { getUserFromEmailAndPassword } from '../services/user';
import config from '../config';

type JwtUser = {
	id: string;
};

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

export async function login(email: string, password: string) {
	const user = await getUserFromEmailAndPassword(email, password);

	const jwtUser: JwtUser = {
		id: user._id.toString(),
	};

	const headerToken = encodeJwt(jwtUser, config.JWT_SECRET);

	return { user, jwt: headerToken };
}
