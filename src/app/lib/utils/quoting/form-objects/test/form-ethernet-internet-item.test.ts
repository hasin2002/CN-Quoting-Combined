import {
  TQuoteAddressInfo,
  TSubProductInfoWholesaleEthernetInternet,
} from "src/app/lib/types/quoting-types";
import { formWholesaleEthernetInternetQuoteItem } from "../form-ethernet-internet-item";

describe("formWholesaleEthernetInternetQuoteItem", () => {
  const mockPostcodeSite: TQuoteAddressInfo = {
    "@type": "PostcodeSite",
    postcode: "SW1A 1AA",
  };

  const mockNadKeySite: TQuoteAddressInfo = {
    "@type": "NadKeySite",
    nadKey: "123/TH",
  };

  const mockSubProductInfo: TSubProductInfoWholesaleEthernetInternet = [
    {
      "@type": "EtherwayFibreService",
      productSpecification: {
        id: "EtherwayFibreService",
      },
      bandwidth: "1 Gbit/s",
      resilience: "Standard",
    },
    {
      "@type": "EtherflowInternetService",
      productSpecification: {
        id: "EtherflowInternetService",
      },
      bandwidth: "100 Mbit/s",
      cos: "Premium CoS",
      ipAddressBlock: "Block /29 (8 LAN IP Addresses)",
    },
  ];

  it("should form a valid quote request with PostcodeSite", () => {
    const result = formWholesaleEthernetInternetQuoteItem(
      [mockPostcodeSite],
      mockSubProductInfo,
      "test-id-123"
    );

    expect(result).toEqual({
      externalId: "test-id-123",
      quoteItem: [
        {
          action: "add",
          product: {
            "@type": "WholesaleEthernetInternet",
            productSpecification: {
              id: "WholesaleEthernetInternet",
            },
            place: [mockPostcodeSite],
            product: mockSubProductInfo,
          },
        },
      ],
    });
  });

  it("should form a valid quote request with NadKeySite", () => {
    const result = formWholesaleEthernetInternetQuoteItem(
      [mockNadKeySite],
      mockSubProductInfo,
      "test-id-456"
    );

    expect(result).toEqual({
      externalId: "test-id-456",
      quoteItem: [
        {
          action: "add",
          product: {
            "@type": "WholesaleEthernetInternet",
            productSpecification: {
              id: "WholesaleEthernetInternet",
            },
            place: [mockNadKeySite],
            product: mockSubProductInfo,
          },
        },
      ],
    });
  });

  it("should handle empty address info array", () => {
    const result = formWholesaleEthernetInternetQuoteItem(
      [],
      mockSubProductInfo,
      "test-id-789"
    );

    expect(result.quoteItem[0].product.place).toEqual([]);
  });

  it("should maintain input reference integrity", () => {
    const addressInfo = [mockPostcodeSite];
    const result = formWholesaleEthernetInternetQuoteItem(
      addressInfo,
      mockSubProductInfo,
      "test-id-999"
    );

    // Verify that modifying the result doesn't affect the original inputs
    result.quoteItem[0].product.place = [];
    expect(addressInfo).toHaveLength(1);
    expect(addressInfo[0]).toEqual(mockPostcodeSite);
  });
});
