import { TBtApiAddresses } from "src/app/lib/schemas/addresses/bt-address-api-schema";
import { cleanAddressInfo } from "../clean-address-data";
import { formFullAddress } from "../form-full-address";

jest.mock("../form-full-address", () => ({
  formFullAddress: jest.fn(
    (address) => `mocked-address-for-${address.postcode}`
  ),
}));

describe("cleanAddressInfo integration test with formFullAddress", () => {
  let simpleArrayOfAddresses: TBtApiAddresses;
  beforeEach(() => {
    // Clear mock before each test
    simpleArrayOfAddresses = [
      {
        addressSource: "Openreach",
        streetName: "Locke Way",
        postcode: "GU21 5FZ",
        city: "Woking",
        country: "United Kingdom",
        county: "Surrey",
        "@type": "BtGeographicAddress",
        geographicLocationRefOrValue: {
          geometry: [
            {
              x: "51.3201747",
              y: "-0.5547339",
            },
          ],
        },
        geographicSubAddress: [
          {
            buildingName: "The Cornerstone",
            subBuilding: "Flat 123",
            "@type": "BtGeographicSubAddress",
          },
        ],
      },
      {
        addressSource: "Openreach",
        streetName: "Locke Way",
        postcode: "GU21 5FZ",
        city: "Woking",
        country: "United Kingdom",
        county: "Surrey",
        "@type": "BtGeographicAddress",
        geographicLocationRefOrValue: {
          geometry: [
            {
              x: "51.3201747",
              y: "-0.5547339",
            },
          ],
        },
        geographicSubAddress: [
          {
            buildingName: "The Cornerstone",
            subBuilding: "Flat 122",
            "@type": "BtGeographicSubAddress",
          },
        ],
      },
    ];
    jest.clearAllMocks();
  });
  it("should return an array of cleaned addresses even if id does not exist", () => {
    const result = cleanAddressInfo(simpleArrayOfAddresses);

    const expected = [
      { fullAddress: "mocked-address-for-GU21 5FZ", postcode: "GU21 5FZ" },
      { fullAddress: "mocked-address-for-GU21 5FZ", postcode: "GU21 5FZ" },
    ];

    expect(result).toEqual(expected);
    expect(formFullAddress).toHaveBeenCalledTimes(2);
    expect(formFullAddress).toHaveBeenCalledWith(simpleArrayOfAddresses[0]);
    expect(formFullAddress).toHaveBeenCalledWith(simpleArrayOfAddresses[1]);
  });

  it("should return an array of cleaned addresses even if some addresses have id and others do not", () => {
    simpleArrayOfAddresses[0].id = "123";
    simpleArrayOfAddresses[0].districtCode = "TH";
    const result = cleanAddressInfo(simpleArrayOfAddresses);

    const expected = [
      {
        fullAddress: "mocked-address-for-GU21 5FZ",
        postcode: "GU21 5FZ",
        id: "123/TH",
      },
      { fullAddress: "mocked-address-for-GU21 5FZ", postcode: "GU21 5FZ" },
    ];
    expect(result).toEqual(expected);
  });

  it("should not return id if districtCode is not present", () => {
    simpleArrayOfAddresses[0].id = "123";
    simpleArrayOfAddresses[1].districtCode = "TH";
    const result = cleanAddressInfo(simpleArrayOfAddresses);

    const expected = [
      {
        fullAddress: "mocked-address-for-GU21 5FZ",
        postcode: "GU21 5FZ",
      },
      { fullAddress: "mocked-address-for-GU21 5FZ", postcode: "GU21 5FZ" },
    ];
    expect(result).toEqual(expected);
  });
});
