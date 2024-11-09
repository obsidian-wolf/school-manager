import axios from 'axios';
import config from '../../config';

const AUTH_DECODED = `${config.AFTERPAY_MERCHANT_ID}:${config.AFTERPAY_SECRET}`;

const AUTH_TOKEN = Buffer.from(AUTH_DECODED).toString('base64');

// https://developers.afterpay.com/
export const api = axios.create({
	baseURL: config.AFTERPAY_URL,
	headers: {
		Authorization: `Basic ${AUTH_TOKEN}`,
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'User-Agent': generateAfterpayAgentHeader(),
	},
});

export function generateAfterpayAgentHeader() {
	const afterpayPlugin = 'Custom Plugin/1.0.0';
	const platform = 'Custom Platform/1.0.0';
	const systemInformation = 'Node.js/20.0.0';
	const merchantId = `EllieMD/${config.AFTERPAY_MERCHANT_ID}`;
	const merchantWebsite = 'https://www.elliemd.com/';
	return `${afterpayPlugin} (${platform}; ${systemInformation}; ${merchantId}) ${merchantWebsite}`;
}
