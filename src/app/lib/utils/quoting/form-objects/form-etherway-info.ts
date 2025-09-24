import { CustomError } from "src/app/lib/schemas/errors/custom-error";
import {
  TEtherwayInfo,
  TInterfaceBandwidth,
  TResilience,
} from "src/app/lib/types/quoting-types";

export const mapCircuitInterfaceToBandwidth = (
  circuitInterface: string
): TInterfaceBandwidth => {
  if (circuitInterface.startsWith("1000BASE")) {
    return "1 Gbit/s";
  }
  if (circuitInterface.startsWith("10GBASE")) {
    return "10 Gbit/s";
  }
  throw new CustomError({
    message: "Invalid circuit interface format",
    source: "QUOTE_FORMATION",
  });
};

export const formEtherwayInfo = (
  circuitInterface: string,
  resilience: TResilience
): TEtherwayInfo => ({
  "@type": "EtherwayFibreService",
  productSpecification: {
    id: "EtherwayFibreService",
  },
  bandwidth: mapCircuitInterfaceToBandwidth(circuitInterface),
  resilience: resilience,
});
