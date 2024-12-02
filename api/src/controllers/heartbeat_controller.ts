import { Get, Route, Tags } from 'tsoa';
import config from '../config';

export const SWAGGER_URL = '/docs';

@Route('heartbeat')
@Tags('Heartbeat')
export class HeartbeatController {
	/**
	 * Ping .. pong
	 */
	@Get()
	public async classHeartbeat() {
		return {
			date: new Date().toString(),
			port: config.PORT,
			message: `We are online, up, and running...  Go to /docs to learn more...`,
		};
	}
}
