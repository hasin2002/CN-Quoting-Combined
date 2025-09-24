import { extractQuotePricingInfo } from "./extract-quote-pricing";
import {
  TBtQuoteResponse,
  TProductPrice,
} from "src/app/lib/schemas/quoting/bt-quote-api-schema";
import { CustomError } from "src/app/lib/schemas/errors/custom-error";

// Helper function to create a product price
const createProductPrice = (
  name: string,
  priceType: "nonRecurring" | "recurring",
  value: number
): TProductPrice => ({
  name,
  priceType,
  recurringChargePeriod: "year",
  price: {
    taxRate: 20,
    dutyFreeAmount: { unit: "GBP", value },
    taxIncludedAmount: { unit: "GBP", value: value * 1.2 },
  },
});

// Helper function to create a basic quote response
const createQuoteResponse = (
  productPrices1: TProductPrice[],
  productPrices2: TProductPrice[],
  isDataCenterQuote = false
): TBtQuoteResponse => ({
  "@baseType": "Quote",
  "@type": "BtwQuote",
  id: "test-id",
  href: "test-href",
  state: "approved",
  quoteItem: [
    {
      "@baseType": "QuoteItem",
      "@type": "BtwQuoteItem",
      action: "add",
      state: "approved",
      product: isDataCenterQuote
        ? {
            "@type": "WholesaleEthernetEline",
            "@baseType": "Product",
            productSpecification: { id: "WholesaleEthernetEline" },
            existingAend: false,
            place: [
              {
                "@type": "PostcodeSite",
                "@baseType": "Place",
                postcode: "EC1A 1BB",
              },
            ],
            product: [
              {
                "@type": "EtherwayFibreService",
                "@baseType": "Product",
                productSpecification: { id: "EtherwayFibreService" },
                productPrice: productPrices1,
                bandwidth: "1 Gbit/s",
                resilience: "Standard",
              },
            ],
            quoteItem: [
              {
                action: "add",
                place: [
                  {
                    "@type": "PostcodeSite",
                    postcode: "EC1A 1BB",
                  },
                ],
                product: [
                  {
                    "@type": "EtherwayFibreService",
                    "@baseType": "Product",
                    productSpecification: { id: "EtherwayFibreService" },
                    bandwidth: "1 Gbit/s",
                    resilience: "Standard",
                    productPrice: productPrices1,
                  },
                  {
                    "@type": "EtherflowConnectedService",
                    "@baseType": "Product",
                    productSpecification: { id: "EtherflowInternetService" },
                    bandwidth: "1 Gbit/s",
                    cos: "Standard CoS",
                    productPrice: productPrices2,
                  },
                ],
              },
            ],
          }
        : {
            "@type": "WholesaleEthernetInternet",
            "@baseType": "Product",
            productSpecification: { id: "WholesaleEthernetInternet" },
            place: [
              {
                "@type": "PostcodeSite",
                postcode: "EC1A 1BB",
              },
            ],
            product: [
              {
                "@type": "EtherwayFibreService",
                "@baseType": "Product",
                productSpecification: { id: "EtherwayFibreService" },
                productPrice: productPrices1,
                bandwidth: "1 Gbit/s",
                resilience: "Standard",
              },
              {
                "@type": "EtherflowInternetService",
                "@baseType": "Product",
                productSpecification: { id: "EtherflowInternetService" },
                productPrice: productPrices2,
                bandwidth: "1 Gbit/s",
                cos: "Standard CoS",
                ipAddressBlock: "Block /29 (8 LAN IP Addresses)",
              },
            ],
          },
    },
  ],
});

describe("extractQuotePricingInfo", () => {
  it("should extract pricing info from a single quote response, scenario 1 and 2.1 part 1", () => {
    const prices = [
      createProductPrice("1 Year connection", "nonRecurring", 1000),
      createProductPrice("1 Year rental", "recurring", 2000),
    ];

    const quoteResponses = [createQuoteResponse(prices, prices)];

    const result = extractQuotePricingInfo(quoteResponses);

    expect(result).toEqual([
      {
        btPricing: {
          etherway: prices,
          etherflow: prices,
        },
      },
    ]);
  });

  it("should handle scenario 3, single service type with a preffered ip backbone that isnt BT", () => {
    const etherwayPrices = [
      createProductPrice("1 Year connection", "nonRecurring", 1000),
      createProductPrice("1 Year rental", "recurring", 2000),
    ];
    const etherflowPrices = [
      createProductPrice("1 Year connection", "nonRecurring", 500),
      createProductPrice("1 Year rental", "recurring", 1000),
    ];

    const quoteResponses = [
      createQuoteResponse(etherwayPrices, etherflowPrices, true),
    ];

    const result = extractQuotePricingInfo(quoteResponses);

    expect(result).toEqual([
      {
        btPricing: {
          etherway: etherwayPrices,
          etherflow: etherflowPrices,
        },
      },
    ]);
  });

  it("should handle dual quotes with circuit2 (scenario 2)", () => {
    const prices = [
      createProductPrice("1 Year connection", "nonRecurring", 1000),
      createProductPrice("1 Year rental", "recurring", 2000),
    ];

    const etherflowCircuit2Prices = [
      createProductPrice("1 Year connection", "nonRecurring", 2250),
      createProductPrice("1 Year rental", "recurring", 4500),
      createProductPrice("1 Year rental", "recurring", 1000),
    ];

    const quoteResponses = [
      createQuoteResponse(prices, prices),
      createQuoteResponse(prices, etherflowCircuit2Prices, true),
    ];

    const result = extractQuotePricingInfo(quoteResponses);

    expect(result).toEqual([
      {
        btPricing: {
          etherway: prices,
          etherflow: prices,
          etherflowCircuit2: etherflowCircuit2Prices,
        },
      },
    ]);
  });

  it("should throw error when pricing info is missing", () => {
    const quoteResponses = [createQuoteResponse([], [])];

    expect(() => extractQuotePricingInfo(quoteResponses)).toThrow(CustomError);
  });

  it("should handle empty product prices arrays", () => {
    const etherwayPrices: TProductPrice[] = [];
    const etherflowPrices = [
      createProductPrice("1 Year rental", "recurring", 2000),
    ];

    const quoteResponses = [
      createQuoteResponse(etherwayPrices, etherflowPrices),
    ];

    const result = extractQuotePricingInfo(quoteResponses);

    expect(result).toEqual([
      {
        btPricing: {
          etherway: [],
          etherflow: etherflowPrices,
        },
      },
    ]);
  });

  it("should filter out Option B items from pricing arrays", () => {
    const pricesWithOptionB = [
      createProductPrice("1 Year connection", "nonRecurring", 1000),
      createProductPrice("1 Year rental", "recurring", 2000),
      createProductPrice("3 Year Option B connection", "nonRecurring", 0),
      createProductPrice("3 Year Option B rental", "recurring", 4176),
    ];

    const expectedFilteredPrices = [
      createProductPrice("1 Year connection", "nonRecurring", 1000),
      createProductPrice("1 Year rental", "recurring", 2000),
    ];

    const quoteResponses = [createQuoteResponse(pricesWithOptionB, pricesWithOptionB)];

    const result = extractQuotePricingInfo(quoteResponses);

    expect(result).toEqual([
      {
        btPricing: {
          etherway: expectedFilteredPrices,
          etherflow: expectedFilteredPrices,
        },
      },
    ]);
  });

  it("should filter out Option B items from etherflowCircuit2", () => {
    const prices = [
      createProductPrice("1 Year connection", "nonRecurring", 1000),
      createProductPrice("1 Year rental", "recurring", 2000),
    ];

    const etherflowCircuit2PricesWithOptionB = [
      createProductPrice("1 Year connection", "nonRecurring", 2250),
      createProductPrice("1 Year rental", "recurring", 4500),
      createProductPrice("3 Year Option B connection", "nonRecurring", 0),
      createProductPrice("3 Year Option B rental", "recurring", 4176),
    ];

    const expectedFilteredCircuit2Prices = [
      createProductPrice("1 Year connection", "nonRecurring", 2250),
      createProductPrice("1 Year rental", "recurring", 4500),
    ];

    const quoteResponses = [
      createQuoteResponse(prices, prices),
      createQuoteResponse(prices, etherflowCircuit2PricesWithOptionB, true),
    ];

    const result = extractQuotePricingInfo(quoteResponses);

    expect(result).toEqual([
      {
        btPricing: {
          etherway: prices,
          etherflow: prices,
          etherflowCircuit2: expectedFilteredCircuit2Prices,
        },
      },
    ]);
  });

  it("should handle arrays with only Option B items", () => {
    const onlyOptionBPrices = [
      createProductPrice("3 Year Option B connection", "nonRecurring", 0),
      createProductPrice("3 Year Option B rental", "recurring", 4176),
    ];

    const quoteResponses = [createQuoteResponse(onlyOptionBPrices, onlyOptionBPrices)];

    const result = extractQuotePricingInfo(quoteResponses);

    expect(result).toEqual([
      {
        btPricing: {
          etherway: [],
          etherflow: [],
        },
      },
    ]);
  });
});
