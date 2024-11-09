import { api } from '.';
import config from '../../config';
import xml2js from 'xml2js';
import { ProductPricing } from '../../resources/products';
import { PersonalInfo } from '../../resources/personal_info';
import { TrinityProduct } from '../../orders/trinity/types';

function getBody(
	personalInfo: PersonalInfo,
	dealer: Record<string, any>,
	dealerId: number,
	month: number,
	product: ProductPricing & { trinityId: TrinityProduct },
) {
	const { billing, shipping, user } = personalInfo;
	const isCustomer = dealer['IsCustomer'] !== '0';
	return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <SaveOrderExtendedWithOptions xmlns="http://www.trinitysoft.net/">
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
            <ShipTo>${user.firstName} ${user.lastName} (Payment ${month + 1})</ShipTo>
            <TotalOrderDiscountPercentage>0</TotalOrderDiscountPercentage>
            <AutoshipOrder>false</AutoshipOrder>
            <OrderDetail>
				<![CDATA[
				<?xml version='1.0' encoding='utf-8'?>
					<ORDER itemcount="1">
						<ORDERDETAIL>
							<PRODUCTNUMBER>${product.trinityId}</PRODUCTNUMBER>
							<PRODUCTQTY>1</PRODUCTQTY>
							<RETAILPRICEEACH>${product.retailPrice}</RETAILPRICEEACH>
							<WHOLESALEPRICEEACH>${product.wholesalePrice}</WHOLESALEPRICEEACH>
							<UPLINEVOLUMEEACH>${product.uplineVolume}</UPLINEVOLUMEEACH>
							<PSVAMOUNTEACH>${product.psvAmount}</PSVAMOUNTEACH>
							<ISFREEPRODUCT>False</ISFREEPRODUCT>
							<FREESHIPPING>False</FREESHIPPING>
						</ORDERDETAIL>
					</ORDER>
				]]>
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
			<OptionsXML>
				<![CDATA[
				<?xml version='1.0' encoding='utf-8'?>
				<OPTIONS optioncount='1'>
					<DONOTSENDORDERRECEIPTEMAIL>TRUE</DONOTSENDORDERRECEIPTEMAIL>
				</OPTIONS>
				]]>
			</OptionsXML>
        </SaveOrderExtendedWithOptions>
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

export async function saveOrderExtendedWithOptions(
	personalInfo: PersonalInfo,
	dealer: Record<string, any>,
	dealerId: number,
	month: number,
	product: ProductPricing & { trinityId: TrinityProduct },
) {
	try {
		const response = await api.post(
			'/FirestormWebServices/FirestormOrderWS.asmx',
			getBody(personalInfo, dealer, dealerId, month, product),
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
			data['soap:Envelope']['soap:Body'][0]['SaveOrderExtendedWithOptionsResponse'][0][
				'SaveOrderExtendedWithOptionsResult'
			][0];
		const rawResponse = await xml2js.parseStringPromise(anotherXmlElement);

		return Object.entries(rawResponse['FIRESTORMRESULT']).reduce<Record<string, any>>(
			(acc, [key, value]) => {
				acc[key] = Array.isArray(value) ? value[0] : value;
				return acc;
			},
			{},
		) as SaveOrderExtendedResponse;
	} catch (err) {
		console.log(err);
		throw err;
	}
}
