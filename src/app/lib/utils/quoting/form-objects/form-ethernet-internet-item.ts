import { TBtQuoteRequestBody } from "src/app/lib/schemas/quoting/bt-quote-api-schema";
import {
  TQuoteAddressInfo,
  TSubProductInfoWholesaleEthernetInternet,
} from "src/app/lib/types/quoting-types";

export const formWholesaleEthernetInternetQuoteItem = (
  quoteAddressInfo: TQuoteAddressInfo[],
  subProductInfo: TSubProductInfoWholesaleEthernetInternet,
  externalId: string
): TBtQuoteRequestBody => {
  return {
    externalId: externalId,
    quoteItem: [
      {
        action: "add",
        product: {
          "@type": "WholesaleEthernetInternet",
          productSpecification: {
            id: "WholesaleEthernetInternet",
          },
          place: quoteAddressInfo,
          product: subProductInfo,
        },
      },
    ],
  };
};
