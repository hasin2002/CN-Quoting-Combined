import * as HttpStatusCodes from "stoker/http-status-codes";
import { createRoute } from "@hono/zod-openapi";
import { jsonContent } from "stoker/openapi/helpers";
import { addressResponseExample } from "../../lib/api-examples/address-success";
import { z } from "zod";
import { createErrorSchema } from "stoker/openapi/schemas";
import { cleanedAddressesSchema } from "src/app/lib/schemas/addresses/cleaned-address";
import { errorSchema } from "src/app/lib/schemas/errors/error-response-schema";
import {
  internalServerErrorExample,
  upstreamErrorExample,
  zodErrorExample,
} from "../../lib/api-examples/error-example";

export const addresses = createRoute({
  description:
    "Endpoint to GET an array of addresses given a post code. The user should be prompted to select their address from this array and the ID for their selected one needs to be stored so it can be used in future API calls",
  method: "get",
  path: `/addresses`,
  request: {
    query: z.object({
      postcode: z
        .string()
        .min(1, "Postcode is required")
        .regex(/^[A-Za-z0-9 ]+$/, "Invalid postcode format"),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      cleanedAddressesSchema.openapi({ example: addressResponseExample }),
      "Return list of addresses"
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

export type AddressesRoute = typeof addresses;
