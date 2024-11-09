/**
 * This file acts as a middleware for express authentication.
 * It is specified in the "tsoa.json" file:  "authenticationModule".
 *
 * You can utilize this file by adding @Security(securityName, scopes) to
 * controllers.
 */
import * as express from 'express';

import { Unauthorized } from '../../common/errors';
import { ADMIN_USERS, decodeJwtFromHeader } from '../../../auth';

export async function expressAuthentication(
	req: express.Request,
	securityName: string,
	// scopes is required for TSOA, but we don't use it
	scopes?: string[],
): Promise<undefined> {
	if (securityName !== 'jwt') {
		return Promise.reject(Unauthorized);
	}

	const decodedJwtUser = decodeJwtFromHeader(req);

	if (!decodedJwtUser) {
		return Promise.reject(Unauthorized);
	}

	const authUser = ADMIN_USERS.find((user) => user.id === decodedJwtUser.id);

	if (!authUser) {
		return Promise.reject(Unauthorized);
	}

	if (scopes?.length) {
		if (!scopes.includes(authUser.scope)) {
			return Promise.reject(Unauthorized);
		}
	}

	return undefined;
}
