import { ErrorRequestHandler } from 'express';
import { ValidateError } from 'tsoa';
import {
	InvalidArgument,
	BadRequest,
	NotFound,
	Unauthorized,
	Forbidden,
} from '../../common/errors';
import { logger } from '../../../utils/logger';

type ErrorResponse = {
	status?: number;
	message?: string;
	details?: any;
	stack?: string;
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	const error = err as any;

	if (!error) {
		next();
		return;
	}

	logger.error(
		{
			err: error,
			req: {
				method: req.method,
				url: req.url,
				headers: req.headers,
				// TODO: sanitize this or exlcude on production
				body: req.body,
				params: req.params,
				query: req.query,
				remoteAddress: req.ip || req.socket.remoteAddress,
			},
		},
		'Middleware error',
	);

	const errResponse: ErrorResponse = {};

	if (error instanceof ValidateError) {
		errResponse.status = 422;
		errResponse.message = 'Validation Failed';
		errResponse.details = error?.fields;
	} else if (error.name === InvalidArgument.name) {
		errResponse.status = 400;
		errResponse.message = error.message;
		errResponse.details = error.details;
	} else if (error.name === BadRequest.name) {
		errResponse.status = 400;
		errResponse.message = error.message;
		errResponse.details = error.details;
	} else if (error.name === NotFound.name) {
		errResponse.status = 404;
		errResponse.message = error.message;
		errResponse.details = error.details;
	} else if (error.name === Unauthorized.name) {
		errResponse.status = 401;
		errResponse.message = error.message;
		errResponse.details = error.details;
	} else if (error.name === Forbidden.name) {
		errResponse.status = 403;
		errResponse.message = error.message;
		errResponse.details = error.details;
	} else {
		errResponse.status = 500;
		errResponse.message = 'Internal Server Error';
		errResponse.details = error.details;
	}

	if (process.env.NODE_ENV !== 'production') {
		errResponse.stack = error.stack;
	}

	res.status(errResponse.status).json(errResponse);
};

export default errorHandler;
