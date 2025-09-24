import { createRoute } from "@hono/zod-openapi";
import { jsonContent } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { z } from "zod";
import { createErrorSchema } from "stoker/openapi/schemas";
import { errorSchema } from "src/app/lib/schemas/errors/error-response-schema";
import { CreateLeadRequestSchema } from "src/app/lib/schemas/zoho/zoho-request-schemas";
import { ZohoLeadApiResponseSchema } from "src/app/lib/schemas/zoho/zoho-api-response-schemas";
import {
  internalServerErrorExample,
  upstreamErrorExample,
  zodErrorExample,
} from "../../../lib/api-examples/error-example";

// Example request body for OpenAPI documentation
const createLeadRequestBodyExample = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  companyName: "Acme Corporation",
};

// Example response for OpenAPI documentation
const createLeadResponseExample = {
  data: [
    {
      code: "SUCCESS",
      details: {
        Modified_Time: "2023-05-10T01:10:47-07:00",
        Modified_By: {
          name: "Patricia Boyle",
          id: "5725767000000411001"
        },
        Created_Time: "2023-05-10T01:10:47-07:00",
        id: "5725767000000524157",
        Created_By: {
          name: "Patricia Boyle",
          id: "5725767000000411001"
        },
        $approval_state: "approved"
      },
      message: "record added",
      status: "success"
    }
  ]
};

export const createLead = createRoute({
  description: "Create a new lead in Zoho CRM",
  method: "post",
  path: "/zoho/lead",
  request: {
    body: jsonContent(
      CreateLeadRequestSchema.openapi({ example: createLeadRequestBodyExample }),
      "Lead creation request body with contact information"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      ZohoLeadApiResponseSchema.openapi({ example: createLeadResponseExample }),
      "Lead successfully created in Zoho CRM"
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
      "Request body validation error."
    ),
    502: jsonContent(
      errorSchema
        .omit({ source: true, zodError: true })
        .openapi({ example: upstreamErrorExample }),
      "Error from Zoho CRM API."
    ),
  },
});

export type CreateLeadRoute = typeof createLead;
