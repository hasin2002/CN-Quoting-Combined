import { z } from "zod";

export const cleanedAddressSchema = z.object({
  id: z.string().optional(),
  postcode: z.string().optional(),
  fullAddress: z.string(),
});

export const cleanedAddressesSchema = z.array(cleanedAddressSchema);

export type TCleanedAddresses = z.infer<typeof cleanedAddressSchema>;
