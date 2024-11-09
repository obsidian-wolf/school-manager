import { api, getSoapXML } from '.';
import config from '../../config';
import xml2js from 'xml2js';

type DealerSearchRequest = {
	DealerID?: string;
	TaxPayerNumber?: string;
	FirstName?: string;
	LastName?: string;
	CompanyName?: string;
	PrimaryEmail?: string;
	SecondaryEmail?: string;
	State?: string;
	DealerURL?: string;
};

export type DealerSearchResponse = {
	DealerID: string;
	TaxPayerNumber: string;
	LastName: string;
	Firstname: string;
	MiddleInitial: '';
	CompanyName: '';
	ShipAddress1: string;
	ShipAddress2: string;
	ShipCity: string;
	ShipState: string;
	ShipZip: string;
	ShipCountry: string;
	MailAddress1: string;
	MailAddress2: string;
	MailCity: string;
	MailState: string;
	MailZip: string;
	MailCountry: string;
	WorkPhone: string;
	HomePhone: string;
	FaxPhone: string;
	CellPhone: string;
	EnrollDate: string;
	EmailPrimary: string;
	EmailSecondary: string;
	BirthDate: string;
	Password: string;
	Account: string;
	SubAccount: string;
	Active: string;
	Deleted: string;
	DealerURL: string;
	IsSentinal: string;
	TaxExempt: string;
	NPO: string;
	IsCustomer: string;
	SponsoringDealerID: string;
	OldID: string;
	EmailOptOutUpline: string;
	EmailOptOutGlobal: string;
	EMailFormatTextOnly: string;
	EmailPrimaryValidated: string;
	CustomerTypeID: string;
	AllowWebAccess: string;
	UseEWalletOnly: string;
	AffiliateSponsoringDealerID: string;
	SMSTextOptOut: string;
	SMSTextOnEnroll: string;
	SMSTextOnOrder: string;
	SMSTextInfoAlerts: string;
	CustomerStatusID: string;
	PayCurrencyTypeID: string;
	APHoldingTank: string;
	ReplicatedShowImage: string;
	ReplicatedShowPhone: string;
	ReplicatedShowEmail: string;
	FullName: string;
};

export async function dealerSearch(
	request: DealerSearchRequest = {},
): Promise<DealerSearchResponse[] | undefined> {
	const response = await api.post(
		'/FirestormWebServices/FirestormDealerWS.asmx',
		getSoapXML('DealerSearch', {
			Token: config.TRINITY_TOKEN,
			Context: config.TRINITY_CONTEXT,
			DealerID: request.DealerID || '',
			TaxPayerNumber: request.TaxPayerNumber || '',
			FirstName: request.FirstName || '',
			LastName: request.LastName || '',
			CompanyName: request.CompanyName || '',
			PrimaryEmail: request.PrimaryEmail || '',
			SecondaryEmail: request.SecondaryEmail || '',
			State: request.State || '',
			DealerURL: request.DealerURL || '',
		}),
		{
			headers: {
				'Content-Type': 'text/xml; charset=utf-8',
			},
		},
	);
	const res = await xml2js.parseStringPromise(response.data);

	const documentElement =
		res['soap:Envelope']['soap:Body'][0]['DealerSearchResponse'][0]['DealerSearchResult'][0][
			'diffgr:diffgram'
		][0]['DocumentElement'];

	if (!documentElement) {
		return undefined;
	}

	const dealers = documentElement[0]['Dealer'];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return dealers.map(({ $, ...res }: any) =>
		Object.entries(res).reduce<Record<string, any>>((acc, [key, value]) => {
			if (Array.isArray(value)) {
				acc[key] = value.join(', ');
			} else {
				acc[key] = value;
			}
			return acc;
		}, {} as DealerSearchResponse),
	);
}
