import { z } from "zod";
import { errorSchema } from "../schemas/errors/error-response-schema";

export const zodErrorExample: z.infer<typeof errorSchema> = {
  message: "Zod error",
  zodError: {
    code: "invalid_type",
    expected: "array",
    received: "object",
    path: [],
    message: "Expected array, received object",
  },
};

export const internalServerErrorExample: z.infer<typeof errorSchema> = {
  message: "Internal server error. Failed to generate token.",
  source: "generateAccessToken() function",
};

export const upstreamErrorExample: z.infer<typeof errorSchema> = {
  message: "Something went wrong. Try again later.",
  btError: {
    message: "Invalid credentials",
    code: 41,
    statusCode: 401,
  },
};
