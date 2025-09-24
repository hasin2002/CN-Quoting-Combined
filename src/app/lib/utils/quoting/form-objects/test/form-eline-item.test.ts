import {
  TQuoteAddressInfo,
  TSubProductInfoWholesaleEthernetEline,
} from "src/app/lib/types/quoting-types";
import { formWholesaleEthernetElineQuoteItem } from "../form-eline-item";

describe("formWholesaleEthernetElineQuoteItem", () => {
  const mockQuoteAddressInfo: TQuoteAddressInfo[] = [
    {
      "@type": "PostcodeSite",
      role: "QuoteSiteLocation",
      postcode: "SY21 7RY",
    },
  ];

  const mockExternalId = "test-external-id-123";

  it("should handle 100 Mbit/s bandwidth with Standard resilience", () => {
    const subProductInfo: TSubProductInfoWholesaleEthernetEline = [
      {
        "@type": "EtherwayFibreService",
        productSpecification: {
          id: "EtherwayFibreService",
        },
        bandwidth: "100 Mbit/s",
        resilience: "Standard",
      },
      {
        "@type": "EtherflowConnectedService",
        productSpecification: {
          id: "EtherflowConnectedService",
        },
        bandwidth: "100 Mbit/s",
        cos: "Default CoS (Standard)",
      },
    ];

    const expectedResult = {
      externalId: mockExternalId,
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
                place: mockQuoteAddressInfo,
                product: subProductInfo,
              },
            ],
          },
        },
      ],
    };

    const result = formWholesaleEthernetElineQuoteItem(
      mockQuoteAddressInfo,
      subProductInfo,
      mockExternalId
    );

    expect(result).toEqual(expectedResult);
  });

  it("should handle 10 Gbit/s bandwidth with Diverse Plus resilience", () => {
    const subProductInfo: TSubProductInfoWholesaleEthernetEline = [
      {
        "@type": "EtherwayFibreService",
        productSpecification: {
          id: "EtherwayFibreService",
        },
        bandwidth: "10 Gbit/s",
        resilience: "Diverse Plus (RAO2)",
      },
      {
        "@type": "EtherflowConnectedService",
        productSpecification: {
          id: "EtherflowConnectedService",
        },
        bandwidth: "10 Gbit/s",
        cos: "Premium CoS",
      },
    ];

    const expectedResult = {
      externalId: mockExternalId,
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
                place: mockQuoteAddressInfo,
                product: subProductInfo,
              },
            ],
          },
        },
      ],
    };

    const result = formWholesaleEthernetElineQuoteItem(
      mockQuoteAddressInfo,
      subProductInfo,
      mockExternalId
    );

    expect(result).toEqual(expectedResult);
  });
});

describe("formWholesaleEthernetElineQuoteItem place tests", () => {
  const mockExternalId = "test-external-id-123";
  const mockSubProductInfo: TSubProductInfoWholesaleEthernetEline = [
    {
      "@type": "EtherwayFibreService",
      productSpecification: {
        id: "EtherwayFibreService",
      },
      bandwidth: "100 Mbit/s",
      resilience: "Standard",
    },
    {
      "@type": "EtherflowConnectedService",
      productSpecification: {
        id: "EtherflowConnectedService",
      },
      bandwidth: "100 Mbit/s",
      cos: "Default CoS (Standard)",
    },
  ];

  it("should handle PostcodeSite input", () => {
    const postcodeSite: TQuoteAddressInfo[] = [
      {
        "@type": "PostcodeSite",
        "@baseType": "Place",
        role: "QuoteSiteLocation",
        postcode: "SY21 7RY",
      },
    ];

    const expectedResult = {
      externalId: mockExternalId,
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
                place: postcodeSite,
                product: mockSubProductInfo,
              },
            ],
          },
        },
      ],
    };

    const result = formWholesaleEthernetElineQuoteItem(
      postcodeSite,
      mockSubProductInfo,
      mockExternalId
    );

    expect(result).toEqual(expectedResult);
  });

  it("should handle NadKeySite input", () => {
    const nadKeySite: TQuoteAddressInfo[] = [
      {
        "@type": "NadKeySite",
        "@baseType": "Place",
        role: "QuoteSiteLocation",
        nadKey: "ABC123",
        postcode: "SY21 7RY",
      },
    ];

    const expectedResult = {
      externalId: mockExternalId,
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
                place: nadKeySite,
                product: mockSubProductInfo,
              },
            ],
          },
        },
      ],
    };

    const result = formWholesaleEthernetElineQuoteItem(
      nadKeySite,
      mockSubProductInfo,
      mockExternalId
    );

    expect(result).toEqual(expectedResult);
  });
});
