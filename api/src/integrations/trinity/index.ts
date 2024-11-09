import axios from 'axios';
import * as js2xmlparser from 'js2xmlparser';
import { XMLValidator } from 'fast-xml-parser';
import { HttpsProxyAgent } from 'https-proxy-agent';

import config from '../../config';
import { BadRequest } from '../../infrastructure/common/errors';

const httpsAgent =
	config.QUOTAGUARDSHIELD_URL &&
	new HttpsProxyAgent(config.QUOTAGUARDSHIELD_URL, {
		rejectUnauthorized: false,
	});

export const api = axios.create({
	baseURL: config.TRINITY_URL, // 'https://partner.elliemd.com', // config.TRINITY_URL,
	httpsAgent,
});

export type AuthBase = {
	Token: string;
	Context: string;
};

export const authBase: AuthBase = {
	Token: config.TRINITY_TOKEN || '',
	Context: config.TRINITY_CONTEXT || '',
};

export function getSoapXML<T>(functionName: string, requestBody: T) {
	const xmlString = js2xmlparser.parse(
		'soap:Envelope',
		{
			'@1': {
				'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
				'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
				'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
			},
			'soap:Body': {
				[functionName]: {
					'@1': { xmlns: 'http://trinitysoft.net/' },
					...requestBody,
				},
			},
		},
		{
			declaration: { encoding: 'utf-8' },
			useSelfClosingTagIfEmpty: false,
			cdataInvalidChars: true,
			format: {
				pretty: false,
				doubleQuotes: true,
			},
		},
	);

	const isValid = XMLValidator.validate(xmlString);

	if (!isValid) {
		throw new BadRequest('Invalid XML');
	}
	return xmlString;
}
