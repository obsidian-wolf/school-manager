import { api } from '.';
import { parseError } from '../../utils/axios';

export type CardToken = {
	key: string;
	merchantId: string;
	customerRef: string;
	expirationMonth: number;
	expirationYear: number;
	accountUpdaterStatus: string;
	shouldUpdateCard: boolean;
	lastAccountUpdaterUpdate: string | null;
	pauseAccountUpdater: boolean;
	createdAt: string;
	updatedAt: string;
	cardType: string;
	firstSix: string;
	lastFour: string;
	token: string;
	cardHolderName: string;
};

// https://docs.nexiopay.com/reference/viewcardtokens
export async function getNexioCardTokens(
	customerRef: string,
	{
		limit = 100,
		offset = 0,
	}: {
		limit?: number;
		offset?: number;
	},
) {
	const { data } = await api.get<{
		offset: number;
		limit: number;
		rows: CardToken[];
	}>(`/card/v3?customerRef=${customerRef}&limit=${limit}&offset=${offset}`);
	return data;
}

export async function getAllNexioCardTokens(customerRef: string) {
	const limit = 100;
	let offset = 0;
	let allCardTokens: CardToken[] = [];
	while (true) {
		const cardTokens = await getNexioCardTokens(customerRef, { limit, offset });
		allCardTokens = [...allCardTokens, ...cardTokens.rows];
		if (cardTokens.rows.length < limit) {
			break;
		}
		offset += limit;
	}
	return allCardTokens;
}

export async function deleteCardTokens(customerRef: string) {
	const cardTokens = await getAllNexioCardTokens(customerRef);
	const tokens = cardTokens.map((cardToken) => cardToken.token);
	if (tokens.length === 0) {
		return 'No tokens to delete';
	}
	try {
		const { data } = await api.post(`pay/v3/deleteToken`, { tokens });
		return data;
	} catch (error) {
		return parseError(error);
	}
}

/**
 * {
      "key": "be5af675-caa3-4586-8006-69cd33428c43.5292712865664733",
      "merchantId": "314467",
      "customerRef": "hanzel.corella@gmail.com",
      "expirationMonth": 10,
      "expirationYear": 2042,
      "accountUpdaterStatus": "isExcluded",
      "shouldUpdateCard": true,
      "lastAccountUpdaterUpdate": null,
      "pauseAccountUpdater": false,
      "createdAt": "2024-08-20T09:06:04.000Z",
      "updatedAt": "2024-08-20T09:06:04.000Z",
      "cardType": "visa",
      "firstSix": "411111",
      "lastFour": "1111",
      "token": "be5af675-caa3-4586-8006-69cd33428c43",
      "cardHolderName": "CJ Visser"
    },
    {
      "key": "ce84325c-a4a6-45a2-bfcd-0f3070e2761b.5292712865664733",
      "merchantId": "314467",
      "customerRef": "hanzel.corella@gmail.com",
      "expirationMonth": 4,
      "expirationYear": 2036,
      "accountUpdaterStatus": "isExcluded",
      "shouldUpdateCard": true,
      "lastAccountUpdaterUpdate": null,
      "pauseAccountUpdater": false,
      "createdAt": "2024-08-20T22:58:04.000Z",
      "updatedAt": "2024-08-20T22:58:04.000Z",
      "cardType": "visa",
      "firstSix": "411111",
      "lastFour": "1111",
      "token": "ce84325c-a4a6-45a2-bfcd-0f3070e2761b",
      "cardHolderName": "hanzel"
    },
 */

/*
GET https://api.nexiopaysandbox.com/card/v3?customerRef=cj@elliemd.com
Authorization: Basic Y2pAZWxsaWVtZC5jb206c3FhYVRtYXU5UXJBTExqOGhORlI=
*/
