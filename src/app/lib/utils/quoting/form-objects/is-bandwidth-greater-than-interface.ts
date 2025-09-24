import { TBandwidth, TCircuitInterface } from "src/app/lib/types/quoting-types";
import { convertBandwidthToMbits } from "../convert-bandwidth-to-mbps";
import { mapCircuitInterfaceToBandwidth } from "./form-etherway-info";

export const isBandwidthGreaterThanInterface = (
  circuitBandwidth: TBandwidth,
  circuitInterface: TCircuitInterface
): boolean => {
  const bandwidthInMbps = convertBandwidthToMbits(circuitBandwidth);
  const interfaceInMbps = convertBandwidthToMbits(
    mapCircuitInterfaceToBandwidth(circuitInterface)
  );

  return bandwidthInMbps > interfaceInMbps;
};
