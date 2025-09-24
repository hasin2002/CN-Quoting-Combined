import { TBtApiAddresses } from "./bt-address-api-schema";

export const resp: TBtApiAddresses = [
  {
    id: "A15099808960",
    addressVerificationNeeded: false,
    addressMatch: false,
    uprn: "100101028314",
    addressSource: "Openreach",
    exchangeGroupCode: "WPL",
    districtCode: "WN",
    qualifier: "Gold",
    streetNr: "10",
    streetName: "Hall Street",
    postcode: "SY21 7RY",
    city: "Welshpool",
    country: "United Kingdom",
    postalOrganisation: "The Tuck Box",
    "@type": "BtGeographicAddress",
    geographicLocationRefOrValue: {
      geometry: [
        {
          x: "52.6606519",
          y: "-3.1483252",
        },
      ],
    },
    geographicSubAddress: [
      {
        "@type": "BtGeographicSubAddress",
      },
    ],
  },
];
