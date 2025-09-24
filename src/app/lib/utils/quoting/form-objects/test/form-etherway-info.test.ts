import { CustomError } from "src/app/lib/schemas/errors/custom-error";

import { TResilience } from "src/app/lib/types/quoting-types";
import {
  formEtherwayInfo,
  mapCircuitInterfaceToBandwidth,
} from "../form-etherway-info";

describe("mapCircuitInterfaceToBandwidth", () => {
  it("should map 1000BASE circuit interface to 1 Gbit/s", () => {
    const result = mapCircuitInterfaceToBandwidth("1000BASE-LX");
    expect(result).toBe("1 Gbit/s");
  });

  it("should map 10GBASE circuit interface to 10 Gbit/s", () => {
    const result = mapCircuitInterfaceToBandwidth("10GBASE-LR");
    expect(result).toBe("10 Gbit/s");
  });

  it("should throw CustomError for invalid circuit interface", () => {
    expect(() => mapCircuitInterfaceToBandwidth("100BASE-TX")).toThrow(
      CustomError
    );
    expect(() => mapCircuitInterfaceToBandwidth("100BASE-TX")).toThrow(
      expect.objectContaining({
        message: "Invalid circuit interface format",
        source: "QUOTE_FORMATION",
      })
    );
  });
});

describe("formEtherwayInfo", () => {
  it("should form correct etherway info object with standard resilience", () => {
    const circuitInterface = "1000BASE-LX";
    const resilience: TResilience = "Standard";

    const result = formEtherwayInfo(circuitInterface, resilience);

    expect(result).toEqual({
      "@type": "EtherwayFibreService",
      productSpecification: {
        id: "EtherwayFibreService",
      },
      bandwidth: "1 Gbit/s",
      resilience: "Standard",
    });
  });

  it("should form correct etherway info object with Diverse Plus (RAO2) resilience", () => {
    const circuitInterface = "10GBASE-LR";
    const resilience: TResilience = "Diverse Plus (RAO2)";

    const result = formEtherwayInfo(circuitInterface, resilience);

    expect(result).toEqual({
      "@type": "EtherwayFibreService",
      productSpecification: {
        id: "EtherwayFibreService",
      },
      bandwidth: "10 Gbit/s",
      resilience: "Diverse Plus (RAO2)",
    });
  });

  it("should throw CustomError when invalid circuit interface is provided", () => {
    const circuitInterface = "100BASE-TX";
    const resilience: TResilience = "Standard";

    expect(() => formEtherwayInfo(circuitInterface, resilience)).toThrow(
      CustomError
    );
  });
});
