import { TBtApiAddress } from "src/app/lib/schemas/addresses/bt-address-api-schema";
// Helper function to create modified copies
export const createAddress = (modifications = {}) => ({
  ...baseAddress,
  ...modifications,
});

export const baseAddress: TBtApiAddress = {
  id: "A00018816602",
  addressVerificationNeeded: false,
  addressMatch: false,
  uprn: "100061659727",
  parentUPRN: "10002423339",
  addressSource: "Openreach",
  exchangeGroupCode: "WK",
  districtCode: "TH",
  qualifier: "Gold",
  streetNr: "17",
  streetName: "Vale Farm Road",
  postcode: "GU21 6DE",
  city: "Woking",
  country: "United Kingdom",
  "@type": "BtGeographicAddress",
  geographicLocationRefOrValue: {
    geometry: [{ x: "51.3186822", y: "-.5642526" }],
  },
  geographicSubAddress: [{ "@type": "BtGeographicSubAddress" }],
};
