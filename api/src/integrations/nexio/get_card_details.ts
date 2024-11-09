import { api } from '.';
import { Customer } from './get_token';

export type CardTokenDetails = {
	accountUpdaterStatus: string;
	card: {
		expirationMonth: string;
		expirationYear: string;
		cardHolderName: string;
		token: string;
	};
	data: {
		customer: Customer;
	};
	dateCreated: string;
	dateLastModified: string;
	merchantId: string;
	shouldUpdateCard: boolean;
	tokenex: {
		cardType: string;
		firstSix: string;
		lastFour: string;
		token: string;
	};
};

// https://docs.nexiopay.com/reference/viewcardtokendetails
export async function getNexioCardDetails(cardToken: string): Promise<CardTokenDetails> {
	const { data } = await api.get<CardTokenDetails>(`/pay/v3/vault/card/${cardToken}`);
	return data;
}

/**
 {
  id: 15198574,
  merchantId: "314467",
  transactionDate: "2024-08-21T17:16:04.000Z",
  amount: 1047,
  authCode: "EA75AT",
  transactionStatus: 10,
  transactionType: 10,
  cardType: 10,
  cardNumber: "411111******1111",
  cardHolder: "asdf",
  processMethod: 10,
  achDetailId: null,
  currencyId: "840",
  reportDate: null,
  settledDate: null,
  capturedDate: "2024-08-21T17:16:04.000Z",
  originalTransactionId: null,
  createdAt: "2024-08-21T17:16:05.000Z",
  updatedAt: "2024-08-21T17:16:05.000Z",
  customer: {
    id: 12620954,
    firstName: "Hanzel",
    lastName: "Corella",
    postalCode: "123",
    phone: null,
    email: "hanzel.corella@gmail.com",
    company: null,
    customerRef: "hanzel.corella@gmail.com",
    transactionId: 15198574,
  },
  kount: {
    id: 7998967,
    status: "A",
    rules: "{\"VERS\":\"0630\",\"MODE\":\"Q\",\"TRAN\":\"AXTH0ACTV3V7\",\"MERC\":\"717000\",\"SESS\":\"a165a58f419a4f7aae093c0cb9f95501\",\"ORDR\":\"66c618dd1bb2f734a2e2223d\",\"AUTO\":\"A\",\"SCOR\":\"36\",\"GEOX\":\"US\",\"BRND\":\"VISA\",\"REGN\":\"US_CA\",\"NETW\":\"N\",\"KAPT\":\"Y\",\"CARDS\":\"1\",\"DEVICES\":\"1\",\"EMAILS\":\"1\",\"VELO\":\"0\",\"VMAX\":\"0\",\"SITE\":\"DEFAULT\",\"DEVICE_LAYERS\":\"7C303A8AD6....826D7AFDAB\",\"FINGERPRINT\":\"FCB08A539DD641E9ACE0071109760952\",\"TIMEZONE\":null,\"LOCALTIME\":\" \",\"REGION\":\"US_CA\",\"COUNTRY\":\"US\",\"PROXY\":\"N\",\"JAVASCRIPT\":\"N\",\"FLASH\":\"N\",\"COOKIES\":\"Y\",\"HTTP_COUNTRY\":\"US\",\"LANGUAGE\":\"EN\",\"MOBILE_DEVICE\":\"N\",\"MOBILE_TYPE\":null,\"MOBILE_FORWARDER\":\"N\",\"VOICE_DEVICE\":\"N\",\"PC_REMOTE\":\"N\",\"RULES_TRIGGERED\":1,\"RULE_ID_0\":\"1004064\",\"RULE_DESCRIPTION_0\":\"Scorecard:  Distance from Device to Billing > 1000km (1)\",\"COUNTERS_TRIGGERED\":1,\"COUNTER_NAME_0\":\"GEO\",\"COUNTER_VALUE_0\":\"1\",\"REASON_CODE\":null,\"MASTERCARD\":\"\",\"DDFS\":\"2024-08-17\",\"DSR\":null,\"UAS\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36\",\"BROWSER\":\"Chrome 127.0.0.0\",\"OS\":\"Windows 10\",\"PIP_IPAD\":null,\"PIP_LAT\":null,\"PIP_LON\":null,\"PIP_COUNTRY\":null,\"PIP_REGION\":null,\"PIP_CITY\":null,\"PIP_ORG\":null,\"IP_IPAD\":\"181.215.175.56\",\"IP_LAT\":\"34.0456\",\"IP_LON\":\"-118.2416\",\"IP_COUNTRY\":\"US\",\"IP_REGION\":\"California\",\"IP_CITY\":\"Los Angeles\",\"IP_ORG\":\"Private Customer\",\"WARNING_COUNT\":0}",
    refNumber: "AXTH0ACTV3V7",
    merc: "717000",
    score: "36",
    ruleCount: 1,
    warningCount: 0,
    counterCount: 1,
    wasDeviceFingerprinted: true,
    mode: "Q",
    velo: 0,
    vmax: 0,
    transactionId: 15198574,
  },
  bankTransfer: null,
  plugin: {
    id: 15087403,
    originalId: "eyJuYW1lIjoibmV4aW8iLCJtZXJjaGFudElkIjoiMzE0NDY3IiwicmVmTnVtYmVyIjoiMGY4YmQ2ZWYtYWRiZS00MjFkLWFhNWEtOWI4MTA1NzRlOTlhIiwicmFuZG9tIjowLCJjdXJyZW5jeSI6InVzZCJ9",
    invoice: null,
    orderNumber: "66c618dd1bb2f734a2e2223d",
    description: null,
    userId: null,
    pluginType: 20,
    paymentOptionTag: null,
    transactionId: 15198574,
  },
  gateway: {
    id: 15155395,
    merchantId: "314467",
    batchRef: null,
    refNumber: "0f8bd6ef-adbe-421d-aa5a-9b810574e99a",
    additionalRefNumber: null,
    trackingCode: null,
    processorLinkId: null,
    gatewayType: 1,
    message: "successful",
    nsu: null,
    transactionId: 15198574,
  },
  processor: null,
  foreignProcessingCurrency: null,
  threeDS: null,
  customerAddresses: {
    id: 5906761,
    billingAddressOne: "123123",
    billingAddressTwo: null,
    billingCity: "123",
    billingState: "IA",
    billingPostalCode: "123",
    billingCountry: "US",
    billingPhone: null,
    shippingAddressOne: "123123",
    shippingAddressTwo: null,
    shippingCity: "123",
    shippingState: "IA",
    shippingPostalCode: "123",
    shippingCountry: "US",
    shippingPhone: null,
    transactionId: 15198574,
  },
  transactionDetails: {
    id: 8956411,
    description: null,
    clientIp: "181.215.175.56",
    userName: "cj@elliemd.com",
    shoppingCart: "{\"items\":[{\"item\":\"Semaglutide\",\"quantity\":1,\"type\":\"sale\",\"price\":1047}]}",
    customFields: null,
    retryCount: null,
    paymentType: "initialUnscheduled",
    installments: null,
    installmentUnit: null,
    surcharge: null,
    transactionId: 15198574,
  },
  subscription: null,
  cardMetaData: {
    id: 5883920,
    cardBrand: "VISA",
    class: 1,
    currencyCode: "840",
    countryCode: "US",
    issuingBank: "JPMORGAN CHASE BANK, N.A.",
    bin: "411111",
    transactionId: 15198574,
  },
  merchantFilterLogic: {
    id: 1791147,
    transactionId: 15198574,
    logic: "{\"requestData\":{\"isDefaultPaymentType\":true,\"currency\":\"USD\",\"paymentType\":\"scheduled\"},\"routingLogic\":{\"paymentMethodAndCurrencyFilter\":{\"list\":[\"314467\"]},\"chosen\":{\"merchantId\":\"314467\",\"gatewayName\":\"nexio\",\"gatewayLabel\":\"unknown\"}}}",
  },
  linkedChargebackId: null,
}
 */
