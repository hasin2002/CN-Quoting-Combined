import { TBtApiAddress } from "src/app/lib/schemas/addresses/bt-address-api-schema";
import { formFullAddress } from "../form-full-address";

describe("formFullAddress", () => {
  // Test case 1: Complete address with all main fields
  it("should correctly form address with all main fields present", () => {
    const address: TBtApiAddress = {
      postalOrganisation: "ACME Corp",
      streetNr: "123",
      streetName: "Main Street",
      locality: "Downtown",
      city: "London",
      postcode: "SW1A 1AA",
    };

    const expected = "ACME Corp, 123, Main Street, Downtown, London, SW1A 1AA";
    expect(formFullAddress(address)).toEqual(expected);
  });

  // Test case 2: Address with sub-address fields
  it("should correctly include sub-address fields when present", () => {
    const address: TBtApiAddress = {
      streetNr: "456",
      streetName: "High Street",
      city: "Manchester",
      postcode: "M1 1AA",
      geographicSubAddress: [
        {
          subBuilding: "Flat 2",
          buildingName: "Victoria House",
          subStreet: "Side Avenue",
          subLocality: "Central District",
        },
      ],
    };

    const expected =
      "Flat 2, Victoria House, Side Avenue, Central District, 456, High Street, Manchester, M1 1AA";
    expect(formFullAddress(address)).toEqual(expected);
  });

  // Test case 3: Address with partial sub-address fields
  it("should handle partial sub-address fields correctly", () => {
    const address: TBtApiAddress = {
      streetNr: "789",
      streetName: "Park Road",
      city: "Birmingham",
      postcode: "B1 1BB",
      geographicSubAddress: [
        {
          buildingName: "Park View",
          subLocality: "Garden District",
        },
      ],
    };

    const expected =
      "Park View, Garden District, 789, Park Road, Birmingham, B1 1BB";
    expect(formFullAddress(address)).toEqual(expected);
  });

  // Test case 4: Address with missing optional fields
  it("should handle missing optional fields gracefully", () => {
    const address: TBtApiAddress = {
      streetNr: "101",
      streetName: "Queen Street",
      city: "Edinburgh",
      postcode: "EH1 1AA",
    };

    const expected = "101, Queen Street, Edinburgh, EH1 1AA";
    expect(formFullAddress(address)).toEqual(expected);
  });
});
