import { TQuoteRequestBody } from "src/app/lib/types/quoting-types";

export const isScenarioOne = (quoteParams: TQuoteRequestBody): boolean => {
  const { serviceType, preferredIpBackbone } = quoteParams.btQuoteParams;
  return serviceType === "single" && preferredIpBackbone === "BT";
};

export const isScenarioTwo = (quoteParams: TQuoteRequestBody): boolean => {
  const { serviceType, dualInternetConfig, circuitTwoBandwidth } =
    quoteParams.btQuoteParams;
  return (
    serviceType === "dual" &&
    dualInternetConfig === "Active / Active" &&
    !!circuitTwoBandwidth
  );
};

export const isScenarioTwoPointOne = (
  quoteParams: TQuoteRequestBody
): boolean => {
  const { serviceType, dualInternetConfig } = quoteParams.btQuoteParams;
  return serviceType === "dual" && dualInternetConfig === "Active / Passive";
};

export const isScenarioThree = (quoteParams: TQuoteRequestBody): boolean => {
  const { serviceType, preferredIpBackbone } = quoteParams.btQuoteParams;
  return (
    serviceType === "single" &&
    !!preferredIpBackbone &&
    preferredIpBackbone !== "BT"
  );
};
