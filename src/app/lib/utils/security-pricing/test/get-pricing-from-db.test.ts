import prisma from "src/app/lib/services/prisma-client";
import { SecurityPricing } from "@prisma/client";
import { CustomError } from "src/app/lib/schemas/errors/custom-error";
import { getSecurityPricingFromDb } from "../get-pricing-from-db";
import { Decimal } from "@prisma/client/runtime/library";

// Mock prisma client
jest.mock("@/lib/services/prisma-client", () => ({
  securityPricing: {
    findFirst: jest.fn(),
  },
}));

describe("getSecurityPricingFromDb", () => {
  const mockSecurityPricing: SecurityPricing = {
    id: 1,
    productCategory: "SITE_BANDWIDTH",
    productSubCategory: "SSE_SITE_BANDWIDTH",
    region: "GENERAL",
    productName: "Test Product",
    maxBandwidthInMbps: 1000,
    productCode: "TEST-CODE",
    productDescription: "Test Description",
    qtyUnits: "NUMBER_OF_SITES",
    listPrice: new Decimal("100.00"),
    revenueType: "RECURRING",
    threatPrevention: new Decimal("50.00"),
    casb: new Decimal("30.00"),
    dlp: new Decimal("40.00"),
    saasSecurityApiOneApp: new Decimal("20.00"),
    saasSecurityApiTwoApps: new Decimal("35.00"),
    saasSecurityApiAllApps: new Decimal("60.00"),
    rbi: new Decimal("45.00"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return pricing data for non-ZTNA case with valid bandwidth", async () => {
    (prisma.securityPricing.findFirst as jest.Mock).mockResolvedValue(
      mockSecurityPricing
    );

    const result = await getSecurityPricingFromDb(false, 1000);

    expect(prisma.securityPricing.findFirst).toHaveBeenCalledWith({
      where: {
        maxBandwidthInMbps: {
          gte: 1000,
        },
      },
    });
    expect(result).toEqual(mockSecurityPricing);
  });

  it("should return pricing data for ZTNA case", async () => {
    const ztnaPricing = { ...mockSecurityPricing, productCode: "CATO-SN-SDP" };
    (prisma.securityPricing.findFirst as jest.Mock).mockResolvedValue(
      ztnaPricing
    );

    const result = await getSecurityPricingFromDb(true, 10000);

    expect(prisma.securityPricing.findFirst).toHaveBeenCalledWith({
      where: {
        productCode: "CATO-SN-SDP",
      },
    });
    expect(result).toEqual(ztnaPricing);
  });

  it("should automatically get security pricing for 5000 Mbit/s if bandwidth exceeds 5000 Mbit/s and ztna is not selected", async () => {
    (prisma.securityPricing.findFirst as jest.Mock).mockResolvedValue(
      mockSecurityPricing
    );

    const result = await getSecurityPricingFromDb(false, 6000);

    expect(prisma.securityPricing.findFirst).toHaveBeenCalledWith({
      where: {
        maxBandwidthInMbps: {
          gte: 5000,
        },
      },
    });
    expect(result).toEqual(mockSecurityPricing);
  });

  it("should throw error when no pricing data is found", async () => {
    (prisma.securityPricing.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(getSecurityPricingFromDb(false, 1000)).rejects.toThrow(
      new CustomError({
        message: "failed to get security pricing info from the database",
        source: "getSecurityPricingFromDb",
      })
    );
  });
});
