import { api, authBase, AuthBase, getSoapXML } from '.';
import xml2js from 'xml2js';

/**
 * For our purposes now, we are only passing in DealerID, and nothing else.
 */
type GetDealerExtendedRequest = {
	DealerID: number;
	TaxPayerNumber: '';
	FirstName: '';
	LastName: '';
	CompanyName: '';
	PrimaryEmail: '';
	SecondaryEmail: '';
	IsCustomer: '';
	OldID: '';
	HomePhone: '';
	WorkPhone: '';
	FaxPhone: '';
	CellPhone: '';
};
type AuthedGetDealerExtendedRequest = GetDealerExtendedRequest & AuthBase;

const baseRequest: AuthedGetDealerExtendedRequest = {
	...authBase,
	DealerID: 0, // org: 43096, hanzel: 813991
	TaxPayerNumber: '',
	FirstName: '',
	LastName: '',
	CompanyName: '',
	PrimaryEmail: '',
	SecondaryEmail: '',
	IsCustomer: '',
	OldID: '',
	HomePhone: '',
	WorkPhone: '',
	FaxPhone: '',
	CellPhone: '',
};

async function getDealerExtended(request: AuthedGetDealerExtendedRequest) {
	const response = await api.post(
		'/FirestormWebServices/FirestormDealerWS.asmx',
		getSoapXML('GetDealerDetailExtended', request),
		{
			headers: {
				'Content-Type': 'text/xml; charset=utf-8',
			},
		},
	);

	const res = await xml2js.parseStringPromise(response.data);
	const documentElement =
		res['soap:Envelope']['soap:Body'][0]['GetDealerDetailExtendedResponse'][0][
			'GetDealerDetailExtendedResult'
		][0]['diffgr:diffgram'][0]['DocumentElement'];

	if (!documentElement) {
		return undefined;
	}

	const dealer = documentElement[0]['Dealer'][0];
	const dealerObj = Object.entries(dealer).reduce<Record<string, any>>((acc, [key, value]) => {
		if (Array.isArray(value)) {
			acc[key] = value[0];
		} else {
			acc[key] = value;
		}
		return acc;
	}, {});
	return dealerObj;
}

export async function getDealerExtendedByDealerId(dealerId: number) {
	return await getDealerExtended({
		...baseRequest,
		DealerID: dealerId,
	});
}

export async function _getSampleDealerExtended() {
	return await getDealerExtendedByDealerId(815229);
}

/**
 * {
  $: {
    "diffgr:id": "Dealer1",
    "msdata:rowOrder": "0",
  },
  DealerID: "43096",
  TaxPayerNumber: "123456789",
  LastName: "",
  Firstname: "",
  MiddleInitial: "",
  CompanyName: "EllieMD Corporate",
  ShipAddress1: "123 Main Street",
  ShipAddress2: "",
  ShipCity: "Dallas",
  ShipState: "TX",
  ShipZip: "76555",
  ShipCountry: "USA",
  MailAddress1: "123 Main Street",
  MailAddress2: "",
  MailCity: "Dallas",
  MailState: "TX",
  MailZip: "76555",
  MailCountry: "USA",
  WorkPhone: "",
  HomePhone: "",
  FaxPhone: "",
  CellPhone: "",
  EnrollDate: "1900-01-01T00:00:00-06:00",
  EmailPrimary: "",
  EmailSecondary: "",
  BirthDate: "1900-01-01T00:00:00-06:00",
  Password: "PaloAlto2024!",
  Account: "123456789",
  SubAccount: "0",
  Active: "-1",
  Deleted: "0",
  DealerURL: "EllieMD",
  IsSentinal: "0",
  TaxExempt: "0",
  WebCatalogueID: "-1",
  WebProductID: "-1",
  NPO: "0",
  IsCustomer: "0",
  OldID: "",
  APPlacementDealerID: "43096",
  APDealershipNumber: "1",
  APLineage: "R",
  EmailOptOutUpline: "-1",
  EmailOptOutGlobal: "-1",
  EMailFormatTextOnly: "-1",
  EmailPrimaryValidated: "0",
  CustomerTypeID: "0",
  AllowWebAccess: "-1",
  UseEWalletOnly: "-1",
  AffiliateSponsoringDealerID: "-1",
  SMSTextOptOut: "-1",
  SMSTextOnEnroll: "0",
  SMSTextOnOrder: "0",
  SMSTextInfoAlerts: "0",
  CustomerStatusID: "-1",
  PayCurrencyTypeID: "-1",
  APHoldingTank: "0",
  ReplicatedShowImage: "-1",
  ReplicatedShowPhone: "0",
  ReplicatedShowEmail: "0",
  StructureSponsoringDealerID: "0",
}
 */
