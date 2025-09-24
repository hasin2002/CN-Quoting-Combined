/**
 * WHOLESALE PRICING API ROUTE
 * 
 * This is the BACKEND API route that provides raw wholesale pricing data.
 * It handles the core business logic for:
 * - BT and Colt network service quoting
 * - Address lookup and validation
 * - Security pricing calculations
 * - External API integrations (BT, Colt, Zoho)
 * 
 * This route returns wholesale pricing without any margin calculations.
 * Margin calculations are handled by the quote-retail API route.
 */

import { NextRequest, NextResponse } from "next/server";
import { QuoteRequestBodySchema } from "../../../src/app/lib/schemas/quoting/quote-request-body-schema";
import { formQuoteItem } from "../../../src/app/lib/utils/quoting/form-objects/form-final-quote-items";
import { extractQuotePricingInfo } from "../../../src/app/lib/utils/quoting/extract-pricing/extract-quote-pricing";
import { QuoteResponse } from "../../../src/app/lib/schemas/quoting/quote-response-schema";
import { getSecurityPricing } from "../../../src/app/lib/utils/security-pricing/security-pricing";
import {
  BtQuoteResponse,
  TBtQuoteResponse,
} from "../../../src/app/lib/schemas/quoting/bt-quote-api-schema";
import btAxiosInstance from "../../../src/app/lib/utils/configure-axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received quote request:", body);
    
    const parsedBody = QuoteRequestBodySchema.parse(body);
    const quoteItems = formQuoteItem(parsedBody);
    
    // Log each BT API request body with proper JSON formatting
    quoteItems.forEach((item, index) => {
      console.log(`BT API Request ${index + 1}/${quoteItems.length}:`, item);
    });
    
    const quoteResponses: TBtQuoteResponse[] = await Promise.all(
      quoteItems.map((item) =>
        btAxiosInstance
          .post<TBtQuoteResponse>("/tmf-api/quoteManagement/v4/quote", item)
          .then((response) => response.data)
      )
    );

    const parsedBtQuoteResponse = BtQuoteResponse.array().parse(quoteResponses);
    const extractedBtPricingInfo = extractQuotePricingInfo(parsedBtQuoteResponse);
    const parsedExtractedBtPricingInfo = QuoteResponse.parse(extractedBtPricingInfo);
    const securityPricingData = await getSecurityPricing(
      parsedBody,
      parsedExtractedBtPricingInfo
    );
    const parsedBtAndSecurityPricingInfo = QuoteResponse.parse(securityPricingData);
    
    console.log("Returning final quote response:", parsedBtAndSecurityPricingInfo);
    
    return NextResponse.json(parsedBtAndSecurityPricingInfo, { status: 200 });
  } catch (error) {
    console.error("Quote processing error:", error);
    
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.message.includes("pricing information")) {
        return NextResponse.json(
          { error: "We couldn't find pricing for your selected configuration. Please try different options or contact support." },
          { status: 406 }
        );
      }
      
      if (error.message.includes("address") || error.message.includes("location")) {
        return NextResponse.json(
          { error: "There's an issue with the selected address. Please try selecting a different address." },
          { status: 400 }
        );
      }
      
      if (error.message.includes("configuration") || error.message.includes("bandwidth")) {
        return NextResponse.json(
          { error: "There's an issue with your network configuration. Please review your selections and try again." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error while processing quote" },
      { status: 500 }
    );
  }
}