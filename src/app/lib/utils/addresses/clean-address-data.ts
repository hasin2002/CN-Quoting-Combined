import { TCleanedAddresses } from "src/app/lib/schemas/addresses/cleaned-address";
import { formFullAddress } from "./form-full-address";
import { TBtApiAddresses } from "src/app/lib/schemas/addresses/bt-address-api-schema";

/**
 * Take the array of address objects from the BT address APIs resposne and tranform it into a simpler object for the front end to handle
 *
 * @param addresses - array of address objects from the BT API address response.
 * @returns an object of shape:
 *    {
 *      id, <this is optional as some only addresses that have the gold qualifier have an id
 *      postcode,
 *      fullAddress
 *    }
 */

export function cleanAddressInfo(
  addresses: TBtApiAddresses
): TCleanedAddresses[] | undefined {
  return addresses.map((address) => {
    const simpleAddress: TCleanedAddresses = {
      fullAddress: formFullAddress(address),
      postcode: address.postcode,
    };

    if (address.id && address.districtCode) {
      simpleAddress.id = `${address.id}/${address.districtCode}`;
    }
    return simpleAddress;
  });
}
