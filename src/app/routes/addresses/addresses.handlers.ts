import { AddressesRoute } from "./addresses.routes";
import { AppRouteHandler } from "src/app/lib/types/types";
import btAxiosInstance from "src/app/lib/utils/configure-axios";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { mapErrorToCustomError } from "src/app/lib/utils/error/error-mapper";
import { cleanAddressInfo } from "src/app/lib/utils/addresses/clean-address-data";
import { filterOpenreachAddresses } from "src/app/lib/utils/addresses/filter-openreach-addresses";
import { cleanedAddressesSchema } from "src/app/lib/schemas/addresses/cleaned-address";
import {
  btAddressApiSchema,
  TBtApiAddresses,
} from "src/app/lib/schemas/addresses/bt-address-api-schema";

export const addresses: AppRouteHandler<AddressesRoute> = async (c) => {
  try {
    const { postcode } = c.req.query();

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
    const parsedCleanedAddresses =
      cleanedAddressesSchema.parse(cleanedAddresses);

    // const parsedAddresses = AddressesSchema.parse(addressesResponse);
    // Return the parsed response with a 200 OK status
    return c.json(parsedCleanedAddresses, HttpStatusCodes.OK);
  } catch (error) {
    // if (axios.isAxiosError(error)) console.log(`👁👁: ${error.config}`);
    const mappedError = mapErrorToCustomError(error, c);
    if (mappedError.statusCode === 502) return c.json(mappedError.error, 502);
    else if (mappedError.statusCode === 406)
      return c.json(mappedError.error, HttpStatusCodes.NOT_ACCEPTABLE);
    else return c.json(mappedError.error, 500);
  }
};
