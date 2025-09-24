import { CustomError } from "src/app/lib/schemas/errors/custom-error";
import {
  TSecurityPricingEntryResponse,
  TSecurityPricingResponse,
} from "src/app/lib/schemas/quoting/quote-response-schema";
import {
  TBandwidth,
  TSecurityQuoteParams,
} from "src/app/lib/types/quoting-types";
import { SecurityPricing } from "@prisma/client";

export const getRelevantPricingData = (
  securityQuoteParams: TSecurityQuoteParams,
  pricingData: SecurityPricing,
  etherflowBandwidth: number
): TSecurityPricingResponse => {
  const {
    ztnaRequired,
    noOfZtnaUsers,
    threatPreventionRequired,
    casbRequired,
    dlpRequired,
    rbiRequired,
  } = securityQuoteParams ?? {};

  // If ZTNA is required, we need to multiply the pricing by the number of ZTNA users
  if (ztnaRequired && !noOfZtnaUsers) {
    throw new CustomError({
      message: "No of ZTNA users is required if ZTNA is required",
      source: "getRelevantPricingData",
    });
  }

  const userMultiplier: number =
    ztnaRequired && noOfZtnaUsers ? noOfZtnaUsers : 1;

  const calculatePricing = (
    basePrice: number,
    useUserMultiplier: boolean
  ): TSecurityPricingEntryResponse => ({
    monthly: basePrice * (useUserMultiplier ? userMultiplier : 1),
  });

  return {
    securityPricing: {
      listPrice: calculatePricing(Number(pricingData.listPrice), true),
      ...(threatPreventionRequired && {
        threatPrevention: calculatePricing(
          Number(pricingData.threatPrevention),
          true
        ),
      }),
      ...(casbRequired && {
        casb: calculatePricing(Number(pricingData.casb), true),
      }),
      ...(dlpRequired && {
        dlp: calculatePricing(Number(pricingData.dlp), true),
      }),
      ...(rbiRequired && {
        rbi: calculatePricing(Number(pricingData.rbi), true),
      }),
      managedServices: calculatePricing(100, false),
    },
  };
};
