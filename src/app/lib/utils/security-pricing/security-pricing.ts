import { CustomError } from "src/app/lib/schemas/errors/custom-error";
import { TQuoteRequestBody } from "src/app/lib/types/quoting-types";
import { TQuoteResponse } from "src/app/lib/schemas/quoting/quote-response-schema";
import { getSecurityPricingFromDb } from "./get-pricing-from-db";
import { getRelevantPricingData } from "./get-relevant-pricing-data";
import { convertBandwidthToMbits } from "../quoting/convert-bandwidth-to-mbps";

export const getSecurityPricing = async (
  quoteParams: TQuoteRequestBody,
  quotePricing: TQuoteResponse
): Promise<TQuoteResponse> => {
  const { securityQuoteParams } = quoteParams;
  const { ztnaRequired, secureIpDelivery } = securityQuoteParams ?? {};
  const { circuitBandwidth: etherflowBandwidth } = quoteParams.btQuoteParams;

  if (!secureIpDelivery) {
    return quotePricing;
  }

  const etherflowBandwidthToMbps = convertBandwidthToMbits(etherflowBandwidth);

  try {
    const pricingData = await getSecurityPricingFromDb(
      ztnaRequired ?? false,
      etherflowBandwidthToMbps
    );
    const relevantPricingData = getRelevantPricingData(
      securityQuoteParams,
      pricingData,
      etherflowBandwidthToMbps
    );

    return quotePricing.map((quote, index) => {
      if (index === 0) {
        return {
          ...quote,
          securityPricing: relevantPricingData.securityPricing,
        };
      }
      return quote;
    });
  } catch (error) {
    if (!(error instanceof CustomError))
      return Promise.reject(
        new CustomError({
          message: "failed to get security pricing",
          source: "getSecurityPricing",
        })
      );
    else return Promise.reject(error);
  }
};
