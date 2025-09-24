/**
 * ADDRESSES API ROUTE
 * 
 * This route handles address lookup functionality.
 * It provides address validation and lookup services for the quoting system.
 */

import { NextRequest, NextResponse } from "next/server";
import btAxiosInstance from "../../../src/app/lib/utils/configure-axios";
import { cleanAddressInfo } from "../../../src/app/lib/utils/addresses/clean-address-data";
import { filterOpenreachAddresses } from "../../../src/app/lib/utils/addresses/filter-openreach-addresses";
import { cleanedAddressesSchema } from "../../../src/app/lib/schemas/addresses/cleaned-address";
import {
  btAddressApiSchema,
  TBtApiAddresses,
} from "../../../src/app/lib/schemas/addresses/bt-address-api-schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postcode = searchParams.get("postcode");

    if (!postcode) {
      return NextResponse.json(
        { error: "Postcode parameter is required" },
        { status: 400 }
      );
    }

    const sanitizedPostcode = postcode.trim();

    // Make the GET request to the geographicAddress endpoint
    const addressesResponse = await btAxiosInstance.get<TBtApiAddresses>(
      `/common/geographicAddressManagement/v1/geographicAddress`,
      {
        params: { postcode: sanitizedPostcode.replace(/\s+/g, "") }, // Remove spaces if required by the API
      }
    );

    // Validate and parse the response data
    const parsedBtAddresses = btAddressApiSchema.parse(addressesResponse.data);
    const openreachAddresses = filterOpenreachAddresses(parsedBtAddresses);
    const cleanedAddresses = cleanAddressInfo(openreachAddresses);
    const parsedCleanedAddresses = cleanedAddressesSchema.parse(cleanedAddresses);

    // Return the parsed response with a 200 OK status
    return NextResponse.json(parsedCleanedAddresses, { status: 200 });
  } catch (error) {
    console.error("Address lookup error:", error);
    
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.message.includes("404") || error.message.includes("Not Found")) {
        return NextResponse.json(
          { error: "No addresses found for this postcode" },
          { status: 404 }
        );
      }
      
      if (error.message.includes("400") || error.message.includes("Bad Request")) {
        return NextResponse.json(
          { error: "Invalid postcode format" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error during address lookup" },
      { status: 500 }
    );
  }
}