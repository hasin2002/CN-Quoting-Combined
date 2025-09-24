import { getRelevantPricingData } from "../get-relevant-pricing-data";
import { CustomError } from "src/app/lib/schemas/errors/custom-error";
import { SecurityPricing } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

describe("getRelevantPricingData", () => {
  const mockPricingData: SecurityPricing = {
    id: 1,
    productCategory: "MANAGED_SERVICES",
    productSubCategory: "SDP_USERS",
    region: "GENERAL",
    productName: "Test Product",
    maxBandwidthInMbps: 1000,
    productCode: "TEST-001",
    productDescription: "Test Description",
    qtyUnits: "NUMBER_OF_USERS",
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

  it("should calculate basic pricing without any additional services", () => {
    const result = getRelevantPricingData({}, mockPricingData, 3000);

    expect(result).toEqual({
      securityPricing: {
        listPrice: {
          monthly: 100,
        },
        managedServices: {
          monthly: 100,
        },
      },
    });
  });

  it("should calculate pricing with ZTNA users multiplier", () => {
    const result = getRelevantPricingData(
      {
        ztnaRequired: true,
        noOfZtnaUsers: 5,
      },
      mockPricingData,
      3000
    );

    expect(result).toEqual({
      securityPricing: {
        listPrice: {
          monthly: 500, // 100 * 5 users
        },
        managedServices: {
          monthly: 100,
        },
      },
    });
  });

  it("should include all optional services when requested", () => {
    const result = getRelevantPricingData(
      {
        threatPreventionRequired: true,
        casbRequired: true,
        dlpRequired: true,
        rbiRequired: true,
      },
      mockPricingData,
      3000
    );

    expect(result).toEqual({
      securityPricing: {
        listPrice: {
          monthly: 100,
        },
        threatPrevention: {
          monthly: 50,
        },
        casb: {
          monthly: 30,
        },
        dlp: {
          monthly: 40,
        },
        rbi: {
          monthly: 45,
        },
        managedServices: {
          monthly: 100,
        },
      },
    });
  });

  it("should throw error when ZTNA is required but no users specified", () => {
    expect(() =>
      getRelevantPricingData(
        {
          ztnaRequired: true,
        },
        mockPricingData,
        3000
      )
    ).toThrow(CustomError);
  });

  it("should handle decimal values correctly", () => {
    const decimalPricingData = {
      ...mockPricingData,
      listPrice: new Decimal("99.99"),
      threatPrevention: new Decimal("49.99"),
    };

    const result = getRelevantPricingData(
      {
        threatPreventionRequired: true,
      },
      decimalPricingData,
      3000
    );

    expect(result.securityPricing.listPrice!.monthly).toBe(99.99);
    expect(result.securityPricing.threatPrevention!.monthly).toBe(49.99);
    expect(result.securityPricing.managedServices.monthly).toBe(100);
  });
});
