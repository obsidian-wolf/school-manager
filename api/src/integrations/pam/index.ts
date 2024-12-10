import axios from 'axios';

const SCHOOL_ID = '6724cd433072a8be299591d1';
const SCHOOL_PASSWORD = '$choo!';

export const pamToken = Buffer.from(`${SCHOOL_ID}:${SCHOOL_PASSWORD}`).toString('base64');

export const api = axios.create({
	baseURL: 'http://localhost:3000', // 'https://pam-ai-whatsapp-6fd00ff950de.herokuapp.com/',
	headers: {
		Authorization: `Basic ${pamToken}`,
	},
});
