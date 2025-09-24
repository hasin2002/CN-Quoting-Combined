import { z } from "zod";
import { TQuoteResponse } from "../schemas/quoting/quote-response-schema";
import { ProductPrice } from "../schemas/quoting/bt-quote-api-schema";

const etherwayMock: z.infer<typeof ProductPrice>[] = [
  {
    name: "1 Year connection",
    priceType: "nonRecurring",
    price: {
      taxRate: 20,
      dutyFreeAmount: {
        unit: "GBP",
        value: 2058,
      },
      taxIncludedAmount: {
        unit: "GBP",
        value: 2469.6,
      },
    },
  },
  {
    name: "1 Year rental",
    priceType: "recurring",
    recurringChargePeriod: "year",
    price: {
      taxRate: 20,
      dutyFreeAmount: {
        unit: "GBP",
        value: 2172,
      },
      taxIncludedAmount: {
        unit: "GBP",
        value: 2606.4,
      },
    },
  },
];

const etherflowMock: z.infer<typeof ProductPrice>[] = [
  {
    name: "1 Year rental",
    priceType: "recurring",
    recurringChargePeriod: "year",
    price: {
      taxRate: 20,
      dutyFreeAmount: {
        unit: "GBP",
        value: 448,
      },
      taxIncludedAmount: {
        unit: "GBP",
        value: 537.6,
      },
    },
  },
];

export const quoteResponseMock: TQuoteResponse = [
  {
    btPricing: {
      etherway: etherwayMock,
      etherflow: etherflowMock,
    },
    securityPricing: {
      listPrice: {
        monthly: 1000,
      },
      threatPrevention: {
        monthly: 100,
      },
      dlp: {
        monthly: 100,
      },
      managedServices: {
        monthly: 100,
      },
    },
  },
];
