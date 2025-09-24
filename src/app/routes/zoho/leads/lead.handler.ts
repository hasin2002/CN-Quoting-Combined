import { AppRouteHandler } from "src/app/lib/types/types";
import { CreateLeadRoute } from "./lead.route";
import { mapErrorToCustomError } from "src/app/lib/utils/error/error-mapper";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { zohoCrmInstance } from "src/app/lib/utils/zoho/configure-zoho-axios-instance";
import { CreateLeadRequestSchema } from "src/app/lib/schemas/zoho/zoho-request-schemas";
import { ZohoLeadApiResponseSchema } from "src/app/lib/schemas/zoho/zoho-api-response-schemas";

export const createLeadHandler: AppRouteHandler<CreateLeadRoute> = async (c) => {
  try {
    const body = await c.req.json();
    c.get("logger").info({ incomingRequest: body }, "Received create lead request");
    
    const parsedBody = CreateLeadRequestSchema.parse(body);
    
    // Transform our API request to Zoho CRM format
    const zohoRequestData = {
      data: [
        {
          Layout: {
            id: "652287000000032033"
          },
          Lead_Source: "website quoting tool",
          Company: parsedBody.companyName || "",
          Last_Name: parsedBody.lastName,
          First_Name: parsedBody.firstName,
          Email: parsedBody.email,
        }
      ]
    };

    c.get("logger").info(
      { zohoApiRequest: zohoRequestData }, 
      "Sending request to Zoho CRM API"
    );

    // Make API call to Zoho CRM
    const response = await zohoCrmInstance.post(
      "/crm/v2.1/Leads",
      zohoRequestData
    );

    const zohoResponse = ZohoLeadApiResponseSchema.parse(response.data);
    
    c.get("logger").info(
      { zohoApiResponse: zohoResponse }, 
      "Received response from Zoho CRM API"
    );
    
    return c.json(zohoResponse, HttpStatusCodes.OK);
  } catch (error) {
    const mappedError = mapErrorToCustomError(error, c);
    if (mappedError.statusCode === 502) return c.json(mappedError.error, 502);
    else if (mappedError.statusCode === 406)
      return c.json(mappedError.error, HttpStatusCodes.NOT_ACCEPTABLE);
    else return c.json(mappedError.error, 500);
  }
};
