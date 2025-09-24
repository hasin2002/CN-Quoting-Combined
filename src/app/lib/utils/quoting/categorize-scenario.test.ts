import {
  isScenarioOne,
  isScenarioTwo,
  isScenarioTwoPointOne,
  isScenarioThree,
} from "./categorize-scenario";
import { TQuoteRequestBody } from "src/app/lib/types/quoting-types";

describe("Scenario Categorization", () => {
  const baseQuoteRequest: TQuoteRequestBody = {
    locationIdentifier: {
      id: "test-id",
      postcode: "EC1A 1BB",
    },
    btQuoteParams: {
      serviceType: "single",
      circuitInterface: "1000BASE-T",
      circuitBandwidth: "100 Mbit/s",
      numberOfIpAddresses: "Block /29 (8 LAN IP Addresses)",
    },
  };

  describe("isScenarioOne", () => {
    it("should return true for single service with BT backbone", () => {
      const request: TQuoteRequestBody = {
        ...baseQuoteRequest,
        btQuoteParams: {
          ...baseQuoteRequest.btQuoteParams,
          serviceType: "single",
          preferredIpBackbone: "BT",
        },
      };
      expect(isScenarioOne(request)).toBe(true);
    });

    it("should return false for single service without BT backbone", () => {
      const request: TQuoteRequestBody = {
        ...baseQuoteRequest,
        btQuoteParams: {
          ...baseQuoteRequest.btQuoteParams,
          serviceType: "single",
          preferredIpBackbone: "Colt",
        },
      };
      expect(isScenarioOne(request)).toBe(false);
    });

    it("should return false for dual service with BT backbone", () => {
      const request: TQuoteRequestBody = {
        ...baseQuoteRequest,
        btQuoteParams: {
          ...baseQuoteRequest.btQuoteParams,
          serviceType: "dual",
          preferredIpBackbone: "BT",
        },
      };
      expect(isScenarioOne(request)).toBe(false);
    });
  });

  describe("isScenarioTwo", () => {
    it("should return true for dual service with Active/Active config and circuit2Bandwidth", () => {
      const request: TQuoteRequestBody = {
        ...baseQuoteRequest,
        btQuoteParams: {
          ...baseQuoteRequest.btQuoteParams,
          serviceType: "dual",
          dualInternetConfig: "Active / Active",
          circuitTwoBandwidth: "100 Mbit/s",
        },
      };
      expect(isScenarioTwo(request)).toBe(true);
    });

    it("should return false when circuit2Bandwidth is missing", () => {
      const request: TQuoteRequestBody = {
        ...baseQuoteRequest,
        btQuoteParams: {
          ...baseQuoteRequest.btQuoteParams,
          serviceType: "dual",
          dualInternetConfig: "Active / Active",
        },
      };
      expect(isScenarioTwo(request)).toBe(false);
    });

    it("should return false for Active/Passive config", () => {
      const request: TQuoteRequestBody = {
        ...baseQuoteRequest,
        btQuoteParams: {
          ...baseQuoteRequest.btQuoteParams,
          serviceType: "dual",
          dualInternetConfig: "Active / Passive",
          circuitTwoBandwidth: "100 Mbit/s",
        },
      };
      expect(isScenarioTwo(request)).toBe(false);
    });
  });

  describe("isScenarioTwoPointOne", () => {
    it("should return true for dual service with Active/Passive config", () => {
      const request: TQuoteRequestBody = {
        ...baseQuoteRequest,
        btQuoteParams: {
          ...baseQuoteRequest.btQuoteParams,
          serviceType: "dual",
          dualInternetConfig: "Active / Passive",
        },
      };
      expect(isScenarioTwoPointOne(request)).toBe(true);
    });

    it("should return false for Active/Active config", () => {
      const request: TQuoteRequestBody = {
        ...baseQuoteRequest,
        btQuoteParams: {
          ...baseQuoteRequest.btQuoteParams,
          serviceType: "dual",
          dualInternetConfig: "Active / Active",
        },
      };
      expect(isScenarioTwoPointOne(request)).toBe(false);
    });

    it("should return false for single service", () => {
      const request: TQuoteRequestBody = {
        ...baseQuoteRequest,
        btQuoteParams: {
          ...baseQuoteRequest.btQuoteParams,
          serviceType: "single",
        },
      };
      expect(isScenarioTwoPointOne(request)).toBe(false);
    });
  });

  describe("isScenarioThree", () => {
    it("should return true for single service with non-BT backbone", () => {
      const request: TQuoteRequestBody = {
        ...baseQuoteRequest,
        btQuoteParams: {
          ...baseQuoteRequest.btQuoteParams,
          serviceType: "single",
          preferredIpBackbone: "Colt",
        },
      };
      expect(isScenarioThree(request)).toBe(true);
    });

    it("should return false for single service with BT backbone", () => {
      const request: TQuoteRequestBody = {
        ...baseQuoteRequest,
        btQuoteParams: {
          ...baseQuoteRequest.btQuoteParams,
          serviceType: "single",
          preferredIpBackbone: "BT",
        },
      };
      expect(isScenarioThree(request)).toBe(false);
    });

    it("should return false for dual service with non-BT backbone", () => {
      const request: TQuoteRequestBody = {
        ...baseQuoteRequest,
        btQuoteParams: {
          ...baseQuoteRequest.btQuoteParams,
          serviceType: "dual",
          preferredIpBackbone: "Colt",
        },
      };
      expect(isScenarioThree(request)).toBe(false);
    });
  });
});
