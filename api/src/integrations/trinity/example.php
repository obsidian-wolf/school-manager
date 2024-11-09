<?php

namespace App\Traits;

use Illuminate\Support\Facades\Log;
use Exception;
use SimpleXMLElement;
use SoapClient;

trait FirestormApiTrait
{
    /**
     * Method to save data to firestorm
     * @param $appointment
     * @return void
     */
    public function saveDateToFirestorm($appointment)
    {
        /** Get product number from template submissions table */
        $productNumber = $this->getProductNumberFromAppointment($appointment);
        $response['message'] = 'error';
        if ($productNumber) {
            /** get catalogue Id from getDealerDetailExtended Api*/
            $catalogueId = $this->getDealerDetailExtended($appointment);
            if ($catalogueId) {
                /** if catalogue id is present then save order to firestorm */
                $responseD = json_decode($this->saveOderExtended($appointment, $catalogueId, $productNumber), TRUE);
                if(@$responseD['message'] == 'error'){
                    $response['message'] = 'error';
                }else{
                    $response['message'] = 'success';
                }
               
            }
        }else {
            addNewLog("Firestorm", "ProductIdMissing",
                'patient_appointments', $appointment->id, "success", []);
        }
        return json_encode($response);
    }

    /**
     * Save order data
     * @param $appointment
     * @param $catalogueId
     * @return false|void
     * @throws \SoapFault
     */
    public function saveOderExtended($appointment, $catalogueId, $productNumber)
    {
        /** Prepare XML */
        $requestXml = $this->buildSaveOrderExtendedXmlRequest($appointment, $catalogueId, $productNumber);
        $apiUrl = config("firestorm.FIRESTORM_SAVE_ORDER_URL");
        $client = new SoapClient($apiUrl . '?wsdl', array('trace' => 1));
        $return['message'] = 'success';
        try {
            addNewLog("Firestorm", "saveOderExtended request",
                'patient_appointments', $appointment->id, "success", ['request' => $requestXml]);

            /** Send Request */
            $response = $client->__doRequest($requestXml, $apiUrl, 'http://www.trinitysoft.net/SaveOrderExtended', SOAP_1_1);
            $response = str_replace(array('&lt;','&gt;'),array('<','>'),$response);
            
            if(strpos($response,'<STATUS>FAIL</STATUS>')!==false){
                $return['message'] = 'error';
            }
            addNewLog("Firestorm", "saveOderExtended response",
                'patient_appointments', $appointment->id, "success", ['respose' => $response]);
        } catch (Exception $e) {
            $return['message'] = 'error';
            addNewLog("Firestorm", "Something went wrong during Saving Order",
                'Firestorm', null, "error", ['error' => $e->getMessage()]);
            Log::error("Firestorm Error" . $e->getMessage());
        }

        return json_encode($return);
    }

    /**
     * Build XML for save order extended
     * @param $appointment
     * @param $catalogueId
     * @return string
     */
    private function buildSaveOrderExtendedXmlRequest($appointment, $catalogueId, $productNumber)
    {
        /** Prepare XML */
        $patient = $appointment->doctalkgoPatientDetails;
        $token = config("firestorm.FIRESTORM_TOKEN");
        $context = config("firestorm.FIRESTORM_CONTEXT");

        $dealerId = $this->getDelerIdFromAppointment($appointment);

        
        $customerId = -1;
        if($catalogueId == '208'){
            $customerId = $dealerId;
            $dealerId = -1;
           
        }

        if(@$patient->last_name!=''){
            $fullname = $patient->first_name.' '.$patient->last_name;
        }else{
            $fullname = $patient->first_name;
        }

        /** check if coupon applied */
        $couponCodeData = $this->getCouponCodeDetailsFromAppointment($appointment);
        $OrderTotalAmt = -99;

        if(@$couponCodeData['code']!='' && @$couponCodeData['amount'] == '100'){
            $OrderTotalAmt = 0;
            /** Prepare Order XML */
            $orderXml = <<<XML
                        <![CDATA[<?xml version='1.0' encoding='utf-8'?>
                            <ORDER itemcount='1'>
                            <ORDERDETAIL>
                            <PRODUCTNUMBER>$productNumber</PRODUCTNUMBER>
                            <PRODUCTQTY>1</PRODUCTQTY>
                            <RETAILPRICEEACH>0</RETAILPRICEEACH>
                            <WHOLESALEPRICEEACH>0</WHOLESALEPRICEEACH>
                            <UPLINEVOLUMEEACH>0</UPLINEVOLUMEEACH>
                            <PSVAMOUNTEACH>0</PSVAMOUNTEACH>
                            <ISFREEPRODUCT>True</ISFREEPRODUCT>
                            <FREESHIPPING>False</FREESHIPPING>
                            </ORDERDETAIL>
                            </ORDER>
                            ]]>
                        XML;

        }else{
            /** Prepare Order XML */
            $orderXml = <<<XML
                        <![CDATA[<?xml version='1.0' encoding='utf-8'?>
                            <ORDER itemcount='1'>
                            <ORDERDETAIL>
                            <PRODUCTNUMBER>$productNumber</PRODUCTNUMBER>
                            <PRODUCTQTY>1</PRODUCTQTY>
                            <RETAILPRICEEACH>-1</RETAILPRICEEACH>
                            <WHOLESALEPRICEEACH>-1</WHOLESALEPRICEEACH>
                            <UPLINEVOLUMEEACH>-1</UPLINEVOLUMEEACH>
                            <PSVAMOUNTEACH>-1</PSVAMOUNTEACH>
                            <ISFREEPRODUCT>False</ISFREEPRODUCT>
                            <FREESHIPPING>False</FREESHIPPING>
                            </ORDERDETAIL>
                            </ORDER>
                            ]]>
                        XML;
        }

        return <<<XML
        <?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                    <SaveOrderExtended xmlns="http://www.trinitysoft.net/">
                        <Token>$token</Token>
                        <Context>$context</Context>
                        <DealerID>$dealerId</DealerID>
                        <ShippingCode>PAID-SHIP</ShippingCode>
                        <ShipAddress1>$patient->shipping_address_line1</ShipAddress1>
                        <ShipAddress2></ShipAddress2>
                        <ShipCity>$patient->shipping_city</ShipCity>
                        <ShipState>$patient->shipping_state</ShipState>
                        <ShipZip>$patient->shipping_postal_code</ShipZip>
                        <ShipCountry>USA</ShipCountry>
                        <Phone>$patient->mobile</Phone>
                        <OrderTotalAmt>$OrderTotalAmt</OrderTotalAmt>
                        <SpecialInstructions></SpecialInstructions>
                        <CatalogueID>$catalogueId</CatalogueID>
                        <BillFirstName>$patient->first_name</BillFirstName>
                        <BillLastName>$patient->last_name</BillLastName>
                        <BillCompanyName></BillCompanyName>
                        <BillAddress1>$patient->shipping_address_line1</BillAddress1>
                        <BillAddress2></BillAddress2>
                        <BillCity>$patient->shipping_city</BillCity>
                        <BillState>$patient->shipping_state</BillState>
                        <BillZip>$patient->shipping_postal_code</BillZip>
                        <BillCountry>USA</BillCountry>
                        <CustomerDealerID>$customerId</CustomerDealerID>
                        <TotalOrderDiscount>0</TotalOrderDiscount>
                        <ShipTo>$fullname</ShipTo>
                        <TotalOrderDiscountPercentage>0</TotalOrderDiscountPercentage>
                        <AutoshipOrder>false</AutoshipOrder>
                        <OrderDetail>$orderXml</OrderDetail>
                        <AddlPaymentInfo></AddlPaymentInfo>
                        <PaymentTypeCode>PRESCRIBERY</PaymentTypeCode>
                        <CardAccountNumber></CardAccountNumber>
                        <CVV2Code></CVV2Code>
                        <CardHolderName></CardHolderName>
                        <CardExpirationMonth></CardExpirationMonth>
                        <CardExpirationYear></CardExpirationYear>
                        <Email>$patient->email</Email>
                        <CommissionAmountToUse>0</CommissionAmountToUse>
                    </SaveOrderExtended>
                </soap:Body>
            </soap:Envelope>
        XML;
    }

    /**
     * Get Detailer details extended
     * @param $appointment
     * @return false|int|void|null
     * @throws \SoapFault
     */
    public function getDealerDetailExtended($appointment)
    {
        $dealerId = $this->getDelerIdFromAppointment($appointment);
        /** proceed if dealer ID is present */
        if ($dealerId && $dealerId > 0) {
            /** Prepare XML */
            $requestXml = $this->buildDealerIdXmlRequest($dealerId);
            $apiUrl = config("firestorm.FIRESTORM_DEALER_DETAILS_URL");
            $client = new SoapClient($apiUrl . '?wsdl', array('trace' => 1));
            try {
                addNewLog("Firestorm", "getDealerDetailExtended request",
                    'patient_appointments', $appointment->id, "success", ['request' => $requestXml]);

                /** Send Request */
                $response = $client->__doRequest($requestXml, $apiUrl, 'http://trinitysoft.net/GetDealerDetailExtended', SOAP_1_1);

                addNewLog("Firestorm", "getDealerDetailExtended response",
                    'patient_appointments', $appointment->id, "success", ['respose' => $response]);

                $xmlResponse = simplexml_load_string($response);
                $xmlResponse->registerXPathNamespace('soap', 'http://schemas.xmlsoap.org/soap/envelope/');
                $result = $xmlResponse->xpath('//soap:Envelope/soap:Body//IsCustomer');
                /** If is cutomer is true then return 208 else return 207 as catalogue ID */
                if (!empty($result)) {
                    if ((int)$result[0] === 0) {
                        return 207;
                    } else if ((int)$result[0] === -1) {
                        return 208;
                    }
                }
                return null;
            } catch (Exception $e) {
                addNewLog("Firestorm", "Something went wrong during Saving Order",
                    'Firestorm', null, "error", ['error' => $e->getMessage()]);
                Log::error("Firestorm Error" . $e->getMessage());
                return false;
            }
        }
        return 208;
    }

    /**
     * Build deler ID XML
     * @param $dealerID
     * @return string
     */
    private function buildDealerIdXmlRequest($dealerID)
    {
        /** Prepare XML */
        $token = config("firestorm.FIRESTORM_TOKEN");
        $context = config("firestorm.FIRESTORM_CONTEXT");

        return <<<XML
                <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:trin="http://trinitysoft.net/">
                   <soapenv:Header/>
                   <soapenv:Body>
                      <trin:GetDealerDetailExtended>
                         <!--Optional:-->
                         <trin:Token>{$token}</trin:Token>
                         <!--Optional:-->
                         <trin:Context>{$context}</trin:Context>
                         <!--Optional:-->
                         <trin:DealerID>{$dealerID}</trin:DealerID>
                         <!--Optional:-->
                         <trin:TaxPayerNumber></trin:TaxPayerNumber>
                         <!--Optional:-->
                         <trin:FirstName></trin:FirstName>
                         <!--Optional:-->
                         <trin:LastName></trin:LastName>
                         <!--Optional:-->
                         <trin:CompanyName></trin:CompanyName>
                         <!--Optional:-->
                         <trin:PrimaryEmail></trin:PrimaryEmail>
                         <!--Optional:-->
                         <trin:SecondaryEmail></trin:SecondaryEmail>
                         <!--Optional:-->
                         <trin:IsCustomer></trin:IsCustomer>
                         <!--Optional:-->
                         <trin:OldID></trin:OldID>
                         <!--Optional:-->
                         <trin:HomePhone></trin:HomePhone>
                         <!--Optional:-->
                         <trin:WorkPhone></trin:WorkPhone>
                         <!--Optional:-->
                         <trin:FaxPhone></trin:FaxPhone>
                         <!--Optional:-->
                         <trin:CellPhone></trin:CellPhone>
                      </trin:GetDealerDetailExtended>
                   </soapenv:Body>
                </soapenv:Envelope>
        XML;
    }

    /**
     * Get dealer ID from appointment
     * @param $appointment
     * @return null
     */
    public function getDelerIdFromAppointment($appointment)
    {
        $metaData = $appointment->meta_data;
        if ($metaData) {
            $metaData1 = json_decode($metaData);
            $metaData2 = json_decode($metaData, TRUE);
            /** Get dealer ID from meta data */
            $dealerId = $metaData1->dealer_id ?? $metaData2['dealer_id'];
            return $dealerId;
        }
        return -1;
    }

    /**
     * Get Product Number from appointment
     * @param $appointment
     * @return null
     */
    public function getProductNumberFromAppointment($appointment)
    {
        return $productNumber;
    }

    /**
     * check coupon code from appointment
     * @param $appointment
     * @return null
     */
    public function getCouponCodeDetailsFromAppointment($appointment)
    {
        $coupon = [];
        
        if(@$appointment->coupon_code!='' && $appointment->coupon_amount!='' && $appointment->coupon_type!='' ) {
            $coupon['code'] = $appointment->coupon_code;
            $coupon['amount'] = $appointment->coupon_amount;
            $coupon['type'] = $appointment->coupon_type;
        }
        return $coupon;
    }

}