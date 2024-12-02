/**
 * This file acts as a middleware for express authentication.
 * It is specified in the "tsoa.json" file:  "authenticationModule".
 *
 * You can utilize this file by adding @Security(securityName, scopes) to
 * controllers.
 */
import * as express from 'express';

import { Unauthorized } from '../../common/errors';
import { decodeJwtFromHeader } from '../../../auth';
import { getUserFromId } from '../../../services/user';
import { ObjectId, WithId } from 'mongodb';
import { User } from '../../../types/parent';

export type AuthedRequest = express.Request & { user: WithId<User> };

export async function expressAuthentication(
	req: express.Request,
	securityName: string,
	// scopes is required for TSOA, but we don't use it
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	scopes?: string[],
) {
	if (securityName !== 'jwt') {
		return Promise.reject(Unauthorized);
	}

	const decodedJwtUser = decodeJwtFromHeader(req);

	if (!decodedJwtUser) {
		return Promise.reject(Unauthorized);
	}

	try {
		if (!ObjectId.isValid(decodedJwtUser.id)) {
			return Promise.reject(Unauthorized);
		}
		const parent = await getUserFromId(new ObjectId(decodedJwtUser.id));
		return Promise.resolve(parent);
	} catch {
		return Promise.reject(Unauthorized);
	}
}
