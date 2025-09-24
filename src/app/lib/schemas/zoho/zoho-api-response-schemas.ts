import { z } from "zod";

export const ZohoUserSchema = z.object({
  name: z.string(),
  id: z.string(),
});

export const ZohoLeadDetailsSchema = z.object({
  Modified_Time: z.string(),
  Modified_By: ZohoUserSchema,
  Created_Time: z.string(),
  id: z.string(),
  Created_By: ZohoUserSchema,
  $approval_state: z.string().optional(),
});

export const ZohoLeadResponseItemSchema = z.object({
  code: z.string(),
  details: ZohoLeadDetailsSchema,
  message: z.string(),
  status: z.string(),
});

export const ZohoLeadApiResponseSchema = z.object({
  data: z.array(ZohoLeadResponseItemSchema),
});

export type TZohoLeadApiResponse = z.infer<typeof ZohoLeadApiResponseSchema>;
export type TZohoLeadResponseItem = z.infer<typeof ZohoLeadResponseItemSchema>;
export type TZohoLeadDetails = z.infer<typeof ZohoLeadDetailsSchema>;
