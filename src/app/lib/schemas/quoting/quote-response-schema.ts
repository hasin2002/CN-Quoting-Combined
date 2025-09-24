import { z } from "zod";
import { ProductPrice } from "./bt-quote-api-schema";

export const SecurityPricingEntrySchema = z.object({
  monthly: z.number(),
});

const SecurityPricingSchema = z.object({
  securityPricing: z.object({
    listPrice: SecurityPricingEntrySchema.optional(),
    threatPrevention: SecurityPricingEntrySchema.optional(),
    casb: SecurityPricingEntrySchema.optional(),
    dlp: SecurityPricingEntrySchema.optional(),
    rbi: SecurityPricingEntrySchema.optional(),
    managedServices: SecurityPricingEntrySchema,
  }),
});

const BTPricingDataSchema = z.object({
  btPricing: z.object({
    etherway: z.array(ProductPrice),
    etherflow: z.array(ProductPrice),
    etherflowCircuit2: z.array(ProductPrice).optional(),
  }),
});

export const QuoteResponse = z.array(
  z.object({
    ...BTPricingDataSchema.shape,
    securityPricing: SecurityPricingSchema.shape.securityPricing.optional(),
  })
);

export type TQuoteResponse = z.infer<typeof QuoteResponse>;

export type TSecurityPricingEntryResponse = z.infer<
  typeof SecurityPricingEntrySchema
>;
export type TSecurityPricingResponse = z.infer<typeof SecurityPricingSchema>;
