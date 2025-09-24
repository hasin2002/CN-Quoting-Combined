import { AppRouteHandler } from "src/app/lib/types/types";
import { QuoteRoute } from "./colt-quote.route";
import { mapErrorToCustomError } from "src/app/lib/utils/error/error-mapper";
import * as HttpStatusCodes from "stoker/http-status-codes";
import axios from "axios";
import { parseStringPromise } from "xml2js";
import { stripPrefix } from "xml2js/lib/processors";

const handleSoapResponse = (parsedXml: any) => {
  try {
    // Access the Envelope
    const envelope = parsedXml["Envelope"];
    if (!envelope) {
      console.error("Envelope not found in the SOAP response.");
      return;
    }

    // Access the Body
    const body = envelope["Body"];
    if (!body) {
      console.error("Body not found in the SOAP response.");
      return;
    }

    // Access checkConnectivityResponse without worrying about namespaces
    const serRootResponse = body["checkConnectivityResponse"];
    if (!serRootResponse) {
      console.error(
        "checkConnectivityResponse not found in the SOAP response."
      );
      return;
    }

    const checkConnectivityResponse =
      serRootResponse["checkConnectivityResponse"];
    if (!checkConnectivityResponse) {
      console.error(
        "Nested checkConnectivityResponse not found in the SOAP response."
      );
      return;
    }

    // Now you can access the actual response details
    console.log(
      "SOAP Response:",
      JSON.stringify(checkConnectivityResponse, null, 2)
    );

    // Further processing can be done here based on your requirements
  } catch (err) {
    console.error("Error processing SOAP response:", err);
  }
};

const soapRequest = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v5="http://www.colt.net/xml/ns/b2bFramework/v5" xmlns:con="http://aat.colt.com/connectivityservice" xmlns:wsse="http://schemas.xmlsoap.org/ws/2002/04/secext">
    <soapenv:Header>
        <wsse:Security soapenv:mustUnderstand="1">
            <wsse:UsernameToken>
                <wsse:Username>LiminexTest</wsse:Username>
                <wsse:Password>ghT3xPS27Tat</wsse:Password>
            </wsse:UsernameToken>
        </wsse:Security>
    </soapenv:Header>
    <soapenv:Body>
        <v5:checkConnectivity>
            <checkConnectivityRequest>
                <con:checkConnectivityRequest con:schemaVersion="5.0">
                    <con:requestType>ALL</con:requestType>
                    <con:requestMode>
                        <con:requestID>123</con:requestID>
                        <con:siteAddress>
                            <con:postalZipCode>EC4M5SB</con:postalZipCode>
                            <con:coltOperatingCountry>United Kingdom</con:coltOperatingCountry>
                            <con:requiredProduct>Colt IP Access</con:requiredProduct>
                            <con:bandwidth>2Mbps</con:bandwidth>
                            <con:connectivityType>COLT Fibre</con:connectivityType>
                        </con:siteAddress>
                    </con:requestMode>
                </con:checkConnectivityRequest>
            </checkConnectivityRequest>
        </v5:checkConnectivity>
    </soapenv:Body>
</soapenv:Envelope>
`;

const soapEndpoint =
  "https://wmisd132.colt.net/ws/ColtB2bFramework.common.webSvcProvider:b2bFramework_v7/ColtB2bFramework_common_webSvcProvider_b2bFramework_v7_Port";

const soapAction =
  "ColtB2bFramework_common_webSvcProvider_b2bFramework_v7_Binder_checkConnectivity";

export const coltQuotingHandler: AppRouteHandler<QuoteRoute> = async (c) => {
  try {
    const response = await axios.post(soapEndpoint, soapRequest, {
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        soapAction: soapAction, // Adjust based on the service's requirements
      },
    });

    // console.log(response.data);

    const parsedResponse = await parseStringPromise(response.data, {
      explicitArray: false,
      tagNameProcessors: [stripPrefix],
    });

    // Handle the parsed response
    handleSoapResponse(parsedResponse);
    return c.json({ message: "success" }, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Error in coltQuotingHandler:", error);
    const mappedError = mapErrorToCustomError(error, c);
    if (mappedError.statusCode === 502) return c.json(mappedError.error, 502);
    else if (mappedError.statusCode === 406)
      return c.json(mappedError.error, HttpStatusCodes.NOT_ACCEPTABLE);
    else return c.json(mappedError.error, 500);
  }
};
