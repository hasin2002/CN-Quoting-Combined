import { z } from "zod";

export const CreateLeadRequestSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  companyName: z.string().optional(),
});

export type TCreateLeadRequest = z.infer<typeof CreateLeadRequestSchema>;
