import axios from 'axios';
import config from '../../config';

export const api = axios.create({
	baseURL: config.PRESCRIBERY_URL,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
});
