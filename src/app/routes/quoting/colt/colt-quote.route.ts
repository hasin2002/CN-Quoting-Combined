import { createRoute } from "@hono/zod-openapi";
import { jsonContent } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { z } from "zod";
import { createErrorSchema } from "stoker/openapi/schemas";
import { errorSchema } from "src/app/lib/schemas/errors/error-response-schema";
import {
  internalServerErrorExample,
  upstreamErrorExample,
  zodErrorExample,
} from "../../../lib/api-examples/error-example";

export const coltQuote = createRoute({
  description: "Endpoint to get a quote for a given address",
  method: "post",
  path: "/colt-quote",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({}),
      "Return quote pricing info for a given address"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorSchema
        .omit({ btError: true, zodError: true })
        .openapi({ example: internalServerErrorExample }),
      "Internal Server Error."
    ),
    [HttpStatusCodes.NOT_ACCEPTABLE]: jsonContent(
      errorSchema
        .omit({ btError: true, source: true })
        .openapi({ example: zodErrorExample }),
      "Formed response doesnt match expected zod schema after processing."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(
        z.object({
          postcode: z
            .string()
            .min(1, "Postcode is required")
            .regex(/^[A-Za-z0-9 ]+$/, "Invalid postcode format"),
        })
      ),
      "Zod query param validation error"
    ),
    502: jsonContent(
      errorSchema
        .omit({ source: true, zodError: true })
        .openapi({ example: upstreamErrorExample }),
      "Error from upstream service. Ie, BT's API."
    ),
  },
});

export type QuoteRoute = typeof coltQuote;
