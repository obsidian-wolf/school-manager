import axios from 'axios';
import config from '../../config';

const AUTH_DECODED = `${config.NEXIO_EMAIL}:${config.NEXIO_PASSWORD}`;

const AUTH_TOKEN = Buffer.from(AUTH_DECODED).toString('base64');

// https://docs.nexiopay.com/
export const api = axios.create({
	baseURL: config.NEXIO_URL,
	headers: {
		Authorization: `Basic ${AUTH_TOKEN}`,
		'Content-Type': 'application/json',
	},
});

// safely join config.APP_URL with /static/pay.css
const css = new URL(config.WEB_URL);
css.pathname = '/pay.css';
export const cssUrl = css.href;
