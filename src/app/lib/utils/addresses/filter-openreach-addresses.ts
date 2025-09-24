import { TBtApiAddresses } from "src/app/lib/schemas/addresses/bt-address-api-schema";

/**
 * Filter the array of addresses from the BT address APIs response so that it only contains openreach addresses
 *
 * @param addresses - Array of address objects from the BT address API response.
 * @returns Array of address objects from the BT address API response filtered to only contain openreach addresses
 */
export const filterOpenreachAddresses = (
  addresses: TBtApiAddresses
): TBtApiAddresses => {
  return addresses.filter((address) => address.addressSource === "Openreach");
};
