import { TBandwidth } from "src/app/lib/types/quoting-types";
import prisma from "src/app/lib/services/prisma-client";
import { SecurityPricing } from "@prisma/client";
import { CustomError } from "src/app/lib/schemas/errors/custom-error";
import { convertBandwidthToMbits } from "../quoting/convert-bandwidth-to-mbps";

export const getSecurityPricingFromDb = async (
  ztnaRequired: boolean,
  etherflowBandwidth: number
): Promise<SecurityPricing> => {
  try {
    const pricingData = await prisma.securityPricing.findFirst({
      where: {
        ...(ztnaRequired
          ? { productCode: "CATO-SN-SDP" }
          : {
              maxBandwidthInMbps: {
                gte:
                  etherflowBandwidth > 5000 && ztnaRequired === false
                    ? 5000
                    : etherflowBandwidth,
              },
            }),
      },
    });
    if (!pricingData) {
      throw new CustomError({
        message: "no pricing data found",
        source: "getSecurityPricingFromDb",
      });
    }
    return pricingData;
  } catch (error) {
    throw new CustomError({
      message: "failed to get security pricing info from the database",
      source: "getSecurityPricingFromDb",
    });
  }
};
