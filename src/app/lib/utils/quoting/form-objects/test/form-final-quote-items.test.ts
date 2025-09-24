import { CustomError } from "src/app/lib/schemas/errors/custom-error";
import * as scenarioHelpers from "../../categorize-scenario";
import * as ethernetInternetItem from "../form-ethernet-internet-item";
import * as elineItem from "../form-eline-item";
import * as etherwayInfo from "../form-etherway-info";
import * as etherflowInfo from "../form-etherflow-info";
import { formQuoteItem } from "../form-final-quote-items";
import { TQuoteRequestBody } from "src/app/lib/types/quoting-types";
import * as bandwidthUtils from "../is-bandwidth-greater-than-interface";

// Mock all imported functions
jest.mock("../../categorize-scenario");
jest.mock("../form-ethernet-internet-item");
jest.mock("../form-eline-item");
jest.mock("../form-etherway-info");
jest.mock("../form-etherflow-info");
jest.mock("../../convert-bandwidth-to-mbps");
jest.mock("../is-bandwidth-greater-than-interface");

// Mock crypto.randomUUID
const mockUUID = "12345678-1234-1234-1234-123456789012";
global.crypto = {
  ...global.crypto,
  randomUUID: () => mockUUID,
};

describe("formQuoteItem", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    (scenarioHelpers.isScenarioOne as jest.Mock).mockReturnValue(false);
    (scenarioHelpers.isScenarioTwo as jest.Mock).mockReturnValue(false);
    (scenarioHelpers.isScenarioTwoPointOne as jest.Mock).mockReturnValue(false);
    (scenarioHelpers.isScenarioThree as jest.Mock).mockReturnValue(false);

    // Mock EtherwayInfo with proper type structure
    (etherwayInfo.formEtherwayInfo as jest.Mock).mockReturnValue({
      "@type": "BtEtherwayFibreService",
      productSpecification: { id: "ETHERWAY_FIBRE" },
      bandwidth: "1 Gbit/s",
      resilience: "Standard",
      productInformation: {
        accessProvider: "Openreach",
        servingExchange: {
          code: "LCSE",
          name: "London Central",
        },
        ethernetSwitch: [
          {
            code: "SWITCH1",
            name: "Primary Switch",
            exchangeDistance: {
              unit: "Metre",
              value: 100,
            },
            siteDistance: {
              unit: "Metre",
              value: 200,
            },
          },
        ],
      },
    });

    // Mock Etherflow Internet Service
    (
      etherflowInfo.formEtherflowInternetServiceInfo as jest.Mock
    ).mockReturnValue({
      "@type": "BtEtherflowInternetService",
      productSpecification: { id: "ETHERFLOW_INTERNET" },
      bandwidth: "100 Mbit/s",
      ipAddressQuantity: "29",
      secureIpDelivery: false,
      preferredIpBackbone: "BT",
    });

    // Mock Etherflow Connected Service
    (
      etherflowInfo.formEtherflowConnectedServiceInfo as jest.Mock
    ).mockReturnValue({
      "@type": "BtEtherflowConnectedService",
      productSpecification: { id: "ETHERFLOW_CONNECTED" },
      bandwidth: "100 Mbit/s",
      cos: "Standard CoS",
    });

    // Mock Internet Quote Item
    (
      ethernetInternetItem.formWholesaleEthernetInternetQuoteItem as jest.Mock
    ).mockReturnValue({
      action: "add",
      "@baseType": "QuoteItem",
      "@type": "BtwQuoteItem",
      product: [
        {
          "@type": "BtEtherwayFibreService",
          productSpecification: { id: "ETHERWAY_FIBRE" },
        },
        {
          "@type": "BtEtherflowInternetService",
          productSpecification: { id: "ETHERFLOW_INTERNET" },
        },
      ],
    });

    // Mock Eline Quote Item
    (
      elineItem.formWholesaleEthernetElineQuoteItem as jest.Mock
    ).mockReturnValue({
      action: "add",
      "@baseType": "QuoteItem",
      "@type": "BtwQuoteItem",
      product: [
        {
          "@type": "BtEtherwayFibreService",
          productSpecification: { id: "ETHERWAY_FIBRE" },
        },
        {
          "@type": "BtEtherflowConnectedService",
          productSpecification: { id: "ETHERFLOW_CONNECTED" },
        },
      ],
    });

    (
      bandwidthUtils.isBandwidthGreaterThanInterface as jest.Mock
    ).mockReturnValue(false);
  });

  const mockBaseQuoteParams: TQuoteRequestBody = {
    locationIdentifier: {
      postcode: "AB12 3CD",
    },
    btQuoteParams: {
      serviceType: "single",
      circuitInterface: "1000BASE-LX",
      circuitBandwidth: "100 Mbit/s",
      numberOfIpAddresses: "Block /29 (8 LAN IP Addresses)",
      preferredIpBackbone: "BT",
    },
    securityQuoteParams: {
      secureIpDelivery: false,
    },
  };

  it("should handle Scenario One correctly", () => {
    (scenarioHelpers.isScenarioOne as jest.Mock).mockReturnValue(true);

    const result = formQuoteItem(mockBaseQuoteParams);

    expect(result).toHaveLength(1);
    expect(
      ethernetInternetItem.formWholesaleEthernetInternetQuoteItem
    ).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Array),
      `1 ${mockUUID}`
    );
  });

  it("should handle Scenario Two correctly", () => {
    (scenarioHelpers.isScenarioTwo as jest.Mock).mockReturnValue(true);

    const paramsWithCircuit2: TQuoteRequestBody = {
      ...mockBaseQuoteParams,
      btQuoteParams: {
        ...mockBaseQuoteParams.btQuoteParams,
        serviceType: "dual",
        circuitTwoBandwidth: "200 Mbit/s",
      },
    };

    const result = formQuoteItem(paramsWithCircuit2);

    expect(result).toHaveLength(2);
    expect(
      ethernetInternetItem.formWholesaleEthernetInternetQuoteItem
    ).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Array),
      `2 ${mockUUID}`
    );
    expect(elineItem.formWholesaleEthernetElineQuoteItem).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Array),
      `2 ${mockUUID}`
    );
  });

  it("should handle Scenario Two Point One correctly", () => {
    (scenarioHelpers.isScenarioTwoPointOne as jest.Mock).mockReturnValue(true);

    const result = formQuoteItem(mockBaseQuoteParams);

    expect(result).toHaveLength(1);
    expect(
      ethernetInternetItem.formWholesaleEthernetInternetQuoteItem
    ).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Array),
      `2.1 ${mockUUID}`
    );
  });

  it("should handle Scenario Three correctly", () => {
    (scenarioHelpers.isScenarioThree as jest.Mock).mockReturnValue(true);

    const result = formQuoteItem(mockBaseQuoteParams);

    expect(result).toHaveLength(1);
    expect(elineItem.formWholesaleEthernetElineQuoteItem).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(Array),
      `3 ${mockUUID}`
    );
  });

  it("should handle NAD key when provided", () => {
    (scenarioHelpers.isScenarioOne as jest.Mock).mockReturnValue(true);

    const paramsWithNadKey = {
      ...mockBaseQuoteParams,
      locationIdentifier: {
        id: "NAD123",
        postcode: "AB12 3CD",
      },
    };

    formQuoteItem(paramsWithNadKey);

    expect(
      ethernetInternetItem.formWholesaleEthernetInternetQuoteItem
    ).toHaveBeenCalledWith(
      [{ "@type": "NadKeySite", nadKey: "NAD123" }],
      expect.any(Array),
      expect.any(String)
    );
  });

  it("should throw error when no scenario matches", () => {
    expect(() => formQuoteItem(mockBaseQuoteParams)).toThrow(CustomError);
    expect(() => formQuoteItem(mockBaseQuoteParams)).toThrow(
      "Something went wrong when forming the quote item to send to BT"
    );
  });

  it("should throw error when circuit bandwidth is greater than interface bandwidth", () => {
    (
      bandwidthUtils.isBandwidthGreaterThanInterface as jest.Mock
    ).mockReturnValue(true);

    (scenarioHelpers.isScenarioOne as jest.Mock).mockReturnValue(true);

    expect(() => formQuoteItem(mockBaseQuoteParams)).toThrow(CustomError);
    expect(() => formQuoteItem(mockBaseQuoteParams)).toThrow(
      "Circuit bandwidth cannot be greater than circuit interface bandwidth"
    );
  });
});
