import { TBandwidth } from "src/app/lib/types/quoting-types";

export const convertBandwidthToMbits = (bandwidth: TBandwidth): number => {
  // Remove spaces and convert to lowercase for easier processing
  const normalized = bandwidth.toLowerCase().replace(/\s/g, "");

  if (normalized.includes("gbit")) {
    // Convert Gbit/s to Mbit/s (multiply by 1000)
    return parseFloat(normalized) * 1000;
  }

  // For Mbit/s values, just parse the number
  return parseFloat(normalized);
};
