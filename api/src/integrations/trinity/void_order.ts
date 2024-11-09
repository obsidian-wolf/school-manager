import { api } from '.';
import config from '../../config';
import xml2js from 'xml2js';

export async function __voidOrder() {
	return await voidOrder('10014179');
}

function getBody(orderId: string) {
	return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <VoidOrder xmlns="http://www.trinitysoft.net/">
            <Token>${config.TRINITY_TOKEN}</Token>
            <Context>${config.TRINITY_CONTEXT}</Context>
            <OrderID>${orderId}</OrderID>
            <VoidReason>Reassessment test order</VoidReason>
            <Override>true</Override>
            <SendNegativeVolumeUp>false</SendNegativeVolumeUp>
            <CreditDeclined>false</CreditDeclined>
            <DeclineReason></DeclineReason>
            <DoClawback>true</DoClawback>
            <NegativeBinaryOnly>false</NegativeBinaryOnly>
            <NegativeUnilevelOnly>false</NegativeUnilevelOnly>
            <NegativeBoth>false</NegativeBoth>
            <VoidChildOrders>false</VoidChildOrders>
        </VoidOrder>
    </soap:Body>
</soap:Envelope>`
		.replaceAll('\t', '')
		.replaceAll('\n', '');
}

export type VoidOrderResponse = {
	STATUS: string; // SUCCESS
	ERRORS: any;
};

export async function voidOrder(orderId: string) {
	try {
		const response = await api.post(
			'/FirestormWebServices/FirestormOrderWS.asmx',
			getBody(orderId),
			{
				headers: {
					'Content-Type': 'text/xml',
					Accept: '*/*',
					// 'Content-Type': 'text/xml; charset=utf-8',
				},
			},
		);
		const data = await xml2js.parseStringPromise(response.data);
		const anotherXmlElement =
			data['soap:Envelope']['soap:Body'][0]['VoidOrderResponse'][0]['VoidOrderResult'][0];
		const rawResponse = await xml2js.parseStringPromise(anotherXmlElement);

		return Object.entries(rawResponse['FIRESTORMRESULT']).reduce<Record<string, any>>(
			(acc, [key, value]) => {
				acc[key] = Array.isArray(value) ? value[0] : value;
				return acc;
			},
			{},
		) as VoidOrderResponse;
	} catch (err) {
		console.log(err);
		throw err;
	}
}
