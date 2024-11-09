import { api } from '.';
import config from '../../config';
import xml2js from 'xml2js';
import { User } from '../../resources/user';
import { Address } from '../../resources/address';
import { getProductFromId, Product } from '../../resources/products';

export async function _saveSampleOrderExtended() {
	return await saveOrderExtended(
		{
			email: 'test@example.com',
		} as User,
		{
			IsCustomer: '0',
		},
		813991,
		{
			stateCode: 'NY',
			address: '123 Main St',
			city: 'New York',
			postcode: '10001',
			phone: '8888888884',
			firstName: 'John',
			lastName: 'Doe',
			email: 'test@example.com',
		},
		{
			stateCode: 'NY',
			address: '123 Main St',
			city: 'New York',
			postcode: '10001',
			phone: '8888888884',
			firstName: 'John',
			lastName: 'Doe',
			email: 'test@example.com',
		},
		getProductFromId('semaglutide_tier_1')!,
	);
}

function getBody(
	user: User,
	dealer: Record<string, any>,
	dealerId: number,
	shipping: Address,
	billing: Address,
	product: Product,
) {
	const isCustomer = dealer['IsCustomer'] !== '0';
	return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <SaveOrderExtended xmlns="http://www.trinitysoft.net/">
            <Token>${config.TRINITY_TOKEN}</Token>
            <Context>${config.TRINITY_CONTEXT}</Context>
            <DealerID>${isCustomer ? -1 : dealerId}</DealerID>
            <ShippingCode>PAID-SHIP</ShippingCode>
            <ShipAddress1>${shipping.address}</ShipAddress1>
            <ShipAddress2></ShipAddress2>
            <ShipCity>${shipping.city}</ShipCity>
            <ShipState>${shipping.stateCode}</ShipState>
            <ShipZip>${shipping.postcode}</ShipZip>
            <ShipCountry>USA</ShipCountry>
            <Phone>${shipping.phone}</Phone>
            <OrderTotalAmt>-99</OrderTotalAmt>
            <SpecialInstructions></SpecialInstructions>
            <CatalogueID>${isCustomer ? 208 : 207}</CatalogueID>
            <BillFirstName>${billing.firstName}</BillFirstName>
            <BillLastName>${billing.lastName}</BillLastName>
            <BillCompanyName></BillCompanyName>
            <BillAddress1>${billing.address}</BillAddress1>
            <BillAddress2></BillAddress2>
            <BillCity>${billing.city}</BillCity>
            <BillState>${billing.stateCode}</BillState>
            <BillZip>${billing.postcode}</BillZip>
            <BillCountry>USA</BillCountry>
            <CustomerDealerID>${isCustomer ? dealerId : -1}</CustomerDealerID>
            <TotalOrderDiscount>0</TotalOrderDiscount>
            <ShipTo>Test Order</ShipTo>
            <TotalOrderDiscountPercentage>0</TotalOrderDiscountPercentage>
            <AutoshipOrder>false</AutoshipOrder>
            <OrderDetail>
				<![CDATA[
				<?xml version='1.0' encoding='utf-8'?><ORDER itemcount="1"><ORDERDETAIL><PRODUCTNUMBER>${product.trinityId}</PRODUCTNUMBER><PRODUCTQTY>1</PRODUCTQTY><RETAILPRICEEACH>${product.retailPrice}</RETAILPRICEEACH><WHOLESALEPRICEEACH>${product.wholesalePrice}</WHOLESALEPRICEEACH><UPLINEVOLUMEEACH>${product.uplineVolume}</UPLINEVOLUMEEACH><PSVAMOUNTEACH>${product.psvAmount}</PSVAMOUNTEACH><ISFREEPRODUCT>False</ISFREEPRODUCT><FREESHIPPING>False</FREESHIPPING></ORDERDETAIL></ORDER>]]>
			</OrderDetail>
            <AddlPaymentInfo></AddlPaymentInfo>
            <PaymentTypeCode>PRESCRIBERY</PaymentTypeCode>
            <CardAccountNumber></CardAccountNumber>
            <CVV2Code></CVV2Code>
            <CardHolderName></CardHolderName>
            <CardExpirationMonth></CardExpirationMonth>
            <CardExpirationYear></CardExpirationYear>
            <Email>${user.email}</Email>
            <CommissionAmountToUse>0</CommissionAmountToUse>
        </SaveOrderExtended>
    </soap:Body>
</soap:Envelope>`
		.replaceAll('\t', '')
		.replaceAll('\n', '');
}

export type SaveOrderExtendedResponse = {
	STATUS: string; // SUCCESS
	ID: string;
	ERRORS: any;
};

export async function saveOrderExtended(
	user: User,
	dealer: Record<string, any>,
	dealerId: number,
	shipping: Address,
	billing: Address,
	product: Product,
) {
	try {
		const response = await api.post(
			'/FirestormWebServices/FirestormOrderWS.asmx',
			getBody(user, dealer, dealerId, shipping, billing, product),
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
			data['soap:Envelope']['soap:Body'][0]['SaveOrderExtendedResponse'][0][
				'SaveOrderExtendedResult'
			][0];
		const rawResponse = await xml2js.parseStringPromise(anotherXmlElement);

		return Object.entries(rawResponse['FIRESTORMRESULT']).reduce<Record<string, any>>(
			(acc, [key, value]) => {
				acc[key] = Array.isArray(value) ? value[0] : value;
				return acc;
			},
			{},
		);
	} catch (err) {
		console.log(err);
		throw err;
	}
}
