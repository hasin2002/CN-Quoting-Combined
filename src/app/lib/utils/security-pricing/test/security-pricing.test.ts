import { getSecurityPricingFromDb } from "../get-pricing-from-db";
import { getRelevantPricingData } from "../get-relevant-pricing-data";
import { CustomError } from "src/app/lib/schemas/errors/custom-error";
import { TBandwidth, TQuoteRequestBody } from "src/app/lib/types/quoting-types";
import { TQuoteResponse } from "src/app/lib/schemas/quoting/quote-response-schema";
import { SecurityPricing } from "@prisma/client";
import { getSecurityPricing } from "../security-pricing";
import { Decimal } from "@prisma/client/runtime/library";
import { convertBandwidthToMbits } from "../../quoting/convert-bandwidth-to-mbps";

// Mock the imported functions
jest.mock("../get-pricing-from-db");
jest.mock("../get-relevant-pricing-data");

describe("getSecurityPricing", () => {
  // Setup mock data
  const mockQuoteParams: TQuoteRequestBody = {
    btQuoteParams: {
      circuitBandwidth: "100 Mbit/s",
      serviceType: "single",
      circuitInterface: "1000BASE-LX",
      numberOfIpAddresses: "Block /29 (8 LAN IP Addresses)",
      preferredIpBackbone: "BT",
    },
    securityQuoteParams: {
      secureIpDelivery: true,
      ztnaRequired: false,
      threatPreventionRequired: true,
      dlpRequired: false,
      casbRequired: false,
      rbiRequired: false,
    },
    locationIdentifier: {
      postcode: "EC1A 1BB",
    },
  };

  const mockQuotePricing: TQuoteResponse = [
    {
      btPricing: {
        etherway: [],
        etherflow: [],
      },
    },
  ];

  const mockSecurityPricingFromDb: SecurityPricing = {
    id: 1,
    productCategory: "SITE_BANDWIDTH",
    productSubCategory: "SSE_SITE_BANDWIDTH",
    region: "GENERAL",
    productName: "Security Gateway 100Mbps",
    maxBandwidthInMbps: 100,
    productCode: "SG-100",
    productDescription: "Security Gateway for 100Mbps bandwidth",
    qtyUnits: "NUMBER_OF_SITES",
    listPrice: new Decimal("100.00"),
    revenueType: "RECURRING",
    threatPrevention: new Decimal("50.00"),
    casb: new Decimal("30.00"),
    dlp: new Decimal("40.00"),
    saasSecurityApiOneApp: new Decimal("20.00"),
    saasSecurityApiTwoApps: new Decimal("35.00"),
    saasSecurityApiAllApps: new Decimal("60.00"),
    rbi: new Decimal("35.00"),
  };

  const mockRelevantPricingData = {
    securityPricing: {
      listPrice: {
        monthly: 100,
      },
      threatPrevention: {
        monthly: 50,
      },
      managedServices: {
        monthly: 100,
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getSecurityPricingFromDb as jest.Mock).mockResolvedValue(
      mockSecurityPricingFromDb
    );
    (getRelevantPricingData as jest.Mock).mockReturnValue(
      mockRelevantPricingData
    );
  });

  it("should return empty array when secureIpDelivery is false", async () => {
    const params = {
      ...mockQuoteParams,
      securityQuoteParams: {
        ...mockQuoteParams.securityQuoteParams,
        secureIpDelivery: false,
      },
    };

    const result = await getSecurityPricing(params, mockQuotePricing);

    expect(result).toEqual(mockQuotePricing);
    expect(getSecurityPricingFromDb).not.toHaveBeenCalled();
    expect(getRelevantPricingData).not.toHaveBeenCalled();
  });

  it("should successfully process security pricing", async () => {
    const result = await getSecurityPricing(mockQuoteParams, mockQuotePricing);

    expect(getSecurityPricingFromDb).toHaveBeenCalledWith(false, 100);
    expect(getRelevantPricingData).toHaveBeenCalledWith(
      mockQuoteParams.securityQuoteParams,
      mockSecurityPricingFromDb,
      100
    );
    expect(result).toEqual([
      {
        ...mockQuotePricing[0],
        securityPricing: mockRelevantPricingData.securityPricing,
      },
    ]);
  });

  it("should only add security pricing to first quote in array", async () => {
    const multipleQuotes: TQuoteResponse = [
      { btPricing: { etherway: [], etherflow: [] } },
      { btPricing: { etherway: [], etherflow: [] } },
    ];

    const result = await getSecurityPricing(mockQuoteParams, multipleQuotes);

    expect(result).toEqual([
      {
        btPricing: { etherway: [], etherflow: [] },
        securityPricing: mockRelevantPricingData.securityPricing,
      },
      { btPricing: { etherway: [], etherflow: [] } },
    ]);
  });

  it("should handle error from getSecurityPricingFromDb", async () => {
    (getSecurityPricingFromDb as jest.Mock).mockRejectedValue(
      new CustomError({
        message: "Database error",
        source: "getSecurityPricingFromDb",
      })
    );

    await expect(
      getSecurityPricing(mockQuoteParams, mockQuotePricing)
    ).rejects.toThrow(CustomError);
  });

  it("should wrap non-CustomError errors", async () => {
    (getSecurityPricingFromDb as jest.Mock).mockRejectedValue(
      new Error("Unknown error")
    );

    await expect(
      getSecurityPricing(mockQuoteParams, mockQuotePricing)
    ).rejects.toThrow(
      new CustomError({
        message: "failed to get security pricing",
        source: "getSecurityPricing",
      })
    );
  });

  // Add test for ZTNA specific pricing
  it("should fetch ZTNA pricing when ztnaRequired is true", async () => {
    const paramsWithZtna = {
      ...mockQuoteParams,
      securityQuoteParams: {
        ...mockQuoteParams.securityQuoteParams,
        ztnaRequired: true,
      },
    };

    const result = await getSecurityPricing(paramsWithZtna, mockQuotePricing);

    expect(getSecurityPricingFromDb).toHaveBeenCalledWith(true, 100);
  });

  // Add test for all security features enabled
  it("should process pricing with all security features enabled", async () => {
    const paramsWithAllFeatures = {
      ...mockQuoteParams,
      securityQuoteParams: {
        secureIpDelivery: true,
        ztnaRequired: true,
        threatPreventionRequired: true,
        dlpRequired: true,
        casbRequired: true,
        rbiRequired: true,
      },
    };

    const mockFullPricingData = {
      securityPricing: {
        listPrice: { monthly: 100 },
        threatPrevention: { monthly: 50 },
        dlp: { monthly: 40 },
        casb: { monthly: 30 },
        rbi: { monthly: 35 },
        managedServices: { monthly: 100 },
      },
    };

    (getRelevantPricingData as jest.Mock).mockReturnValue(mockFullPricingData);

    const result = await getSecurityPricing(
      paramsWithAllFeatures,
      mockQuotePricing
    );

    expect(result[0].securityPricing).toEqual(
      mockFullPricingData.securityPricing
    );
  });

  // Add test for bandwidth validation
  it("should handle different bandwidth options", async () => {
    const bandwidthVariations: TBandwidth[] = [
      "100 Mbit/s",
      "10 Gbit/s",
      "1 Gbit/s",
    ];

    for (const bandwidth of bandwidthVariations) {
      const paramsWithBandwidth = {
        ...mockQuoteParams,
        btQuoteParams: {
          ...mockQuoteParams.btQuoteParams,
          circuitBandwidth: bandwidth,
        },
      };

      await getSecurityPricing(paramsWithBandwidth, mockQuotePricing);
      expect(getSecurityPricingFromDb).toHaveBeenCalledWith(
        false,
        convertBandwidthToMbits(bandwidth)
      );
    }
  });
});
