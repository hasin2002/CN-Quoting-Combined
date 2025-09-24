import { TBtApiAddress } from "src/app/lib/schemas/addresses/bt-address-api-schema";

/**
 * Forms a full address string from a GeographicAddress object.
 *
 * @param address - Single address object from an array of addresses from the BT address response.
 * @returns A string containing the address information to display to the user.
 */

export const formFullAddress = (address: TBtApiAddress): string => {
  //Array of keys for address info
  const mainAddressFields: string[] = [
    "postalOrganisation",
    "streetNr",
    "streetName",
    "locality",
    "city",
    "postcode",
  ];
  // An address can have a geographic sub-address property.
  // This property can contain additional address information and is an object itself.
  // This array holds the keys for the sub-address information we want to include.
  const subAddressFields: string[] = [
    "subBuilding",
    "buildingName",
    "subStreet",
    "subLocality",
  ];
  // Extract values for the main address fields:
  // - Object.keys(address) retrieves the keys of the address object passed in.
  // - The filter ensures we only have the keys that contain address information.
  // - The map returns an array where each entry is the value for each of the filtered keys.
  const mainAddressValues = Object.keys(address)
    .filter((field) => mainAddressFields.includes(field))
    .map((field) => address[field as keyof typeof address]);

  let subAddressValues;
  if (address.geographicSubAddress) {
    // Use Object.keys to get the keys for the first geographicSubAddress object.
    // Filter these to only include the sub-address keys we need.
    const existingSubAddressFields = Object.keys(
      address.geographicSubAddress[0]
    ).filter((field) => subAddressFields.includes(field));
    // subAddressValues is an array where each value corresponds to each filtered key.
    subAddressValues = existingSubAddressFields.map(
      (field) =>
        address.geographicSubAddress![0][
          field as keyof (typeof address.geographicSubAddress)[0]
        ]
    );
  }

  let fullAddress;
  //if sub address info exists make sure its included in the final address string first
  if (subAddressValues) {
    fullAddress = [...subAddressValues, ...mainAddressValues].join(", ");
  }
  //if sub address info doesnt exist just return the main address info as a string
  else {
    fullAddress = mainAddressValues.join(", ");
  }

  return fullAddress;
};
