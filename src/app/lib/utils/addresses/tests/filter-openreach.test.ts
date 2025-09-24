import { filterOpenreachAddresses } from "src/app/lib/utils/addresses/filter-openreach-addresses";
import { baseAddress, createAddress } from "./filter-openreach-test-examples";
import { TBtApiAddresses } from "src/app/lib/schemas/addresses/bt-address-api-schema";

describe("filterOpenreachAddresses", () => {
  it("should filter and return only Openreach addresses from a mixed list", () => {
    const mixedAddressesInput = [
      baseAddress,
      createAddress({ addressSource: "ROBT" }),
      createAddress({ id: "A00018816722", addressSource: "Openreach" }),
      createAddress({ addressSource: "ROBT" }),
    ];

    const result = filterOpenreachAddresses(mixedAddressesInput);
    expect(result).toEqual([
      baseAddress,
      createAddress({ id: "A00018816722", addressSource: "Openreach" }),
    ]);
    expect(result.length).toBeLessThan(mixedAddressesInput.length);
    result.forEach((address) => {
      expect(address.addressSource).toBe("Openreach");
    });
  });

  it("should return an empty array when no Openreach addresses exist", () => {
    const nonOpenreachAddresses = [
      createAddress({ addressSource: "ROBT" }),
      createAddress({ addressSource: "ROBT" }),
    ];

    const result = filterOpenreachAddresses(nonOpenreachAddresses);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it("should return an empty array when input array is empty", () => {
    const emptyAddresses: TBtApiAddresses = [];
    const result = filterOpenreachAddresses(emptyAddresses);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it("should correctly handle addresses with missing addressSource property", () => {
    const addressesWithMissingSource = [
      createAddress({ addressSource: undefined }),
      baseAddress,
      createAddress({ addressSource: "ROBT" }),
    ];

    const result = filterOpenreachAddresses(addressesWithMissingSource);
    expect(result).toEqual([baseAddress]);
    expect(result.every((addr) => addr.addressSource === "Openreach")).toBe(
      true
    );
  });

  it("should preserve all address fields when filtering a single Openreach address", () => {
    const singleAddress = [baseAddress];

    const result = filterOpenreachAddresses(singleAddress);
    expect(result).toEqual(singleAddress);
    expect(result[0]).toMatchObject({
      addressSource: "Openreach",
      streetNr: expect.any(String),
      streetName: expect.any(String),
      city: expect.any(String),
      postcode: expect.any(String),
    });
  });
});
