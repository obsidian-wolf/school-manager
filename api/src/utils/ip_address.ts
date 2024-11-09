import axios, { AxiosInstance } from 'axios';
import os from 'os';

export function getServerIp() {
	const interfaces = os.networkInterfaces();
	for (const interfaceName in interfaces) {
		for (const iface of interfaces[interfaceName]!) {
			if (iface.family === 'IPv4' && !iface.internal) {
				return iface.address;
			}
		}
	}
	return '127.0.0.1'; // fallback to localhost
}

export async function getRealIp(api?: AxiosInstance) {
	const res = await (api || axios.create()).get('https://api64.ipify.org?format=json');
	const ip = res.data.ip;
	return ip as string;
}
