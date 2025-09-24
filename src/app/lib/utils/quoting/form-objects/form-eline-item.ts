import { TBtQuoteRequestBody } from "src/app/lib/schemas/quoting/bt-quote-api-schema";
import {
  TQuoteAddressInfo,
  TSubProductInfoWholesaleEthernetEline,
} from "src/app/lib/types/quoting-types";

export const formWholesaleEthernetElineQuoteItem = (
  quoteAddressInfo: TQuoteAddressInfo[],
  subProductInfo: TSubProductInfoWholesaleEthernetEline,
  externalId: string
): TBtQuoteRequestBody => {
  return {
    externalId: externalId,
    quoteItem: [
      {
        action: "add",
        product: {
          "@type": "WholesaleEthernetEline",
          existingAend: true,
          productSpecification: {
            id: "WholesaleEthernetEline",
          },
          place: [
            {
              "@type": "DataCentreSite",
              dataCentreCode: "YDABX/TA",
            },
          ],
          product: [
            {
              "@type": "EtherwayDataCentreService",
              productSpecification: {
                id: "EtherwayDataCentreService",
              },
              bandwidth: "1 Gbit/s",
            },
          ],
          quoteItem: [
            {
              action: "add",
              place: quoteAddressInfo,
              product: subProductInfo,
            },
          ],
        },
      },
    ],
  };
};
