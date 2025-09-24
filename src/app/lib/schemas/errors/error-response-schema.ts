import { z } from "zod";

export const errorSchema = z.object({
  message: z.string(),
  source: z.string().optional(),
  btError: z
    .object({
      statusCode: z.number(),
      code: z.number(),
      message: z.string(),
    })
    .optional(),
  zodError: z
    .object({
      code: z.string(),
      expected: z.unknown(),
      received: z.unknown(),
      path: z.array(z.union([z.string(), z.number()])),
      message: z.string(),
    })
    .optional(),
});

const mappedErrorSchema = z.object({
  statusCode: z.union([z.literal(500), z.literal(502), z.literal(406)]),
  error: errorSchema,
});

export type TMappedError = z.infer<typeof mappedErrorSchema>;
