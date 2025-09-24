import { AppRouteHandler } from "src/app/lib/types/types";
import { QuoteRoute } from "./quote.route";
import { mapErrorToCustomError } from "src/app/lib/utils/error/error-mapper";
import * as HttpStatusCodes from "stoker/http-status-codes";
import btAxiosInstance from "src/app/lib/utils/configure-axios";
import { QuoteRequestBodySchema } from "src/app/lib/schemas/quoting/quote-request-body-schema";
import { z } from "zod";
import { formQuoteItem } from "src/app/lib/utils/quoting/form-objects/form-final-quote-items";
import { extractQuotePricingInfo } from "src/app/lib/utils/quoting/extract-pricing/extract-quote-pricing";
import { QuoteResponse } from "src/app/lib/schemas/quoting/quote-response-schema";
import { getSecurityPricing } from "src/app/lib/utils/security-pricing/security-pricing";
import {
  BtQuoteResponse,
  TBtQuoteResponse,
} from "src/app/lib/schemas/quoting/bt-quote-api-schema";

export const btQuotingHandler: AppRouteHandler<QuoteRoute> = async (c) => {
  try {
    const body = await c.req.json();
    c.get("logger").info({ incomingRequest: body }, "Received quote request");
    
    const parsedBody = QuoteRequestBodySchema.parse(body);
    const quoteItems = formQuoteItem(parsedBody);
    
    // Log each BT API request body with proper JSON formatting
    quoteItems.forEach((item, index) => {
      c.get("logger").info(
        { 
          btApiRequest: item,
          requestIndex: index + 1,
          totalRequests: quoteItems.length
        }, 
        `BT API Request ${index + 1}/${quoteItems.length}`
      );
    });
    
    const quoteResponses: TBtQuoteResponse[] = await Promise.all(
      quoteItems.map((item) =>
        btAxiosInstance
          .post<TBtQuoteResponse>("/tmf-api/quoteManagement/v4/quote", item)
          .then((response) => response.data)
      )
    );
    // console.log(JSON.stringify(quoteResponses, null, 2));

    const parsedBtQuoteResponse = z
      .array(BtQuoteResponse)
      .parse(quoteResponses);
    const extractedBtPricingInfo = extractQuotePricingInfo(
      parsedBtQuoteResponse
    );
    const parsedExtractedBtPricingInfo = QuoteResponse.parse(
      extractedBtPricingInfo
    );
    const securityPricingData = await getSecurityPricing(
      parsedBody,
      parsedExtractedBtPricingInfo
    );
    const parsedBtAndSecurityPricingInfo =
      QuoteResponse.parse(securityPricingData);
    
    c.get("logger").info(
      { finalResponse: parsedBtAndSecurityPricingInfo }, 
      "Returning final quote response"
    );
    
    return c.json(parsedBtAndSecurityPricingInfo, HttpStatusCodes.OK);
  } catch (error) {
    const mappedError = mapErrorToCustomError(error, c);
    if (mappedError.statusCode === 502) return c.json(mappedError.error, 502);
    else if (mappedError.statusCode === 406)
      return c.json(mappedError.error, HttpStatusCodes.NOT_ACCEPTABLE);
    else return c.json(mappedError.error, 500);
  }
};
