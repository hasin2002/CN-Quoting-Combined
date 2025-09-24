import { TQuoteRequestBody } from "../types/quoting-types";

export const quoteRequestBodyExample: TQuoteRequestBody = {
  locationIdentifier: { postcode: "SW1A 1AA" },
  btQuoteParams: {
    circuitInterface: "10GBASE-SR",
    serviceType: "single",
    preferredIpBackbone: "BT",
    circuitBandwidth: "10 Gbit/s",
    numberOfIpAddresses: "Block /29 (8 LAN IP Addresses)",
  },
  securityQuoteParams: {
    secureIpDelivery: true,
    ztnaRequired: true,
    noOfZtnaUsers: 10,
    threatPreventionRequired: true,
    casbRequired: true,
    dlpRequired: true,
  },
};
