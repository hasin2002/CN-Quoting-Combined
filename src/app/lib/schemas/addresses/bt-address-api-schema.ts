import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const GeographicPoint = z
  .object({ x: z.string(), y: z.string() })
  .partial()
  .passthrough();
const GeographicLocation = z
  .object({
    geometry: z.array(GeographicPoint),
    spatialRef: z.enum(["WGS84", "BNG"]),
  })
  .partial()
  .passthrough();
const GeographicSubAddress = z
  .object({ buildingName: z.string().max(50) })
  .partial()
  .passthrough();
const GeographicAddress = z
  .object({
    id: z.string(),
    uprn: z.string(),
    parentUPRN: z.string(),
    addressSource: z.enum(["ROBT", "Openreach"]),
    exchangeGroupCode: z.string(),
    districtCode: z.string(),
    qualifier: z.enum(["Gold", "Non-Gold", "Silver"]),
    streetNr: z.string(),
    streetName: z.string(),
    postcode: z.string(),
    locality: z.string(),
    city: z.string(),
    country: z.string(),
    "@type": z.literal("BtGeographicAddress").optional(),
    geographicLocationRefOrValue: GeographicLocation,
    geographicSubAddress: z.array(GeographicSubAddress),
  })
  .partial()
  .passthrough();
const ErrorRepresentation = z
  .object({
    code: z.string(),
    reason: z.string(),
    message: z.string().optional(),
  })
  .passthrough();

export const schemas = {
  GeographicPoint,
  GeographicLocation,
  GeographicSubAddress,
  GeographicAddress,
  ErrorRepresentation,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/geographicAddress",
    alias: "geographicAddressFind",
    description: `This operation is used to retrieve geographic addresses corresponding to search criteria.

The request must contain one of the listed combinations of the query parameters, as outlined below:
- postcode (Any combination which includes the parameter postcode)
- uprn (Any combination which includes the parameter uprn)
- city + streetName + streetNr
- city + streetName + buildingName

 &lt;details&gt;
&lt;summary&gt;&lt;b&gt;Sandbox responses&lt;/b&gt;&lt;/summary&gt;

&lt;p&gt;The sandbox supports a number of success and failure scenarios. Use the parameters below in the sandbox API call to generate the corresponding responses.&lt;/p&gt;
&lt;p&gt;Success and failure example responses are simulated based on the APIGW-Tracking-Header provided in the request.&lt;/p&gt;

&lt;details&gt;
&lt;summary&gt;&lt;b&gt;Success scenarios&lt;/b&gt;&lt;/summary&gt; 

| Query parameters | Response details | Description |
| ----------- | ------------------- | ------------------ |  
| When postcode &quot;AB15%207XY&quot; and buildingName &quot;Riverside%20Tower&quot; is passed in query. | 200 | Provide this value in the request to get geographic addresses based on postcode and building name search. |
| When postcode &quot;AB15%207XY&quot; and streetNr &quot;10&quot; is passed in query.  | 200 | Provide this value in the request to get geographic addresses based on postcode and street number search. |
| When postcode &quot;AB15%207XY&quot; is passed in query.  | 200 | Provide this value in the request to get geographic addresses based on postcode search. |
| When city &quot;London&quot;, streetName &quot;Riverside%20Tower&quot; and streetNumber &quot;10&quot; is passed in query.  | 200 | Provide this value in the request to get geographic addresses based on city, street name and street number search. |
| When city &quot;London&quot;, streetName &quot;Riverside%20Tower&quot; and buildingName &quot;Riverside%20Tower&quot; is passed in query. | 200 | Provide this value in the request to get geographic addresses based on city, street name and building name search. |
| When uprn &quot;990000377850&quot; is passed in query.  | 200 | Provide this value in the request to get geographic addresses based on UPRN search. |

&lt;/details&gt;

&lt;details&gt;
&lt;summary&gt;&lt;b&gt;Error scenarios&lt;/b&gt;&lt;/summary&gt;    

| APIGW-Tracking-Header | Sandbox response invoked | Description |
| ----------- | ------------ | ------------ | 
| E00101 | 500, 01 | Internal Error. |
| E00501 | 503, 05 | The service is temporarily unavailable. |
| E02901 | 400, 29 | Bad Request. |
| E06001 | 404, 60 | Resource not found. |
| When none of the query parameters are passed in request. | 400, 27 | Missing query-string parameter. |

&lt;/details&gt;
&lt;/details&gt;
`,
    requestFormat: "json",
    parameters: [
      {
        name: "postcode",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "streetNr",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "buildingName",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "city",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "streetName",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "uprn",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "addressSource",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "isSpatialRefBng",
        type: "Query",
        schema: z.boolean().optional().default(false),
      },
      {
        name: "APIGW-Tracking-Header",
        type: "Header",
        schema: z.string().regex(/^[\w.~:@-]{1,255}$/),
      },
      {
        name: "Authorization",
        type: "Header",
        schema: z.string(),
      },
      {
        name: "userId",
        type: "Header",
        schema: z.string().optional(),
      },
      {
        name: "btDuns",
        type: "Header",
        schema: z.string().optional(),
      },
    ],
    response: z.array(GeographicAddress),
    errors: [
      {
        status: 400,
        description: `&lt;p&gt;Bad Request&lt;/p&gt;

| Code | Message | Description |
| ---- | ------- | ----------- |
| 25 | Missing header: \&lt;parameter\&gt;| The indicated parameter is missing from the request header. |
| 26 | Invalid header value: \&lt;parameter\&gt;| The indicated parameter in the request header is not recognised. |


&lt;p&gt;Backend Errors&lt;/p&gt;

| Code | Message | Description |
| ---- | ------- | ----------- |
| 20 | Invalid URL parameter value |  One or more parameters in the URL are not valid. |
| 25 | Missing header | The indicated parameter is missing from the request header. |
| 26 | Invalid header value | The indicated parameter in the request header is not recognised. |
| 27 | Missing query-string parameter | One or more query-string parameters are missing. |
| 28 | Invalid query-string parameter value | One or more query-string parameters contain invalid values. |`,
        schema: ErrorRepresentation,
      },
      {
        status: 401,
        description: `&lt;p&gt;Unauthorized&lt;/p&gt;

| Code  | Message  |   Description  |
| ----  | -------  | -------------- |
| 40 | Missing credentials| The Authorization parameter is missing.|
| 41 | Invalid credentials| The Authorization parameter is not valid. |
| 42 | Expired credentials| Renew the access token using the OAuth API and try again.|`,
        schema: ErrorRepresentation,
      },
      {
        status: 403,
        description: `&lt;p&gt;Forbidden&lt;/p&gt;

| Code | Message | Description |
| ---- | ------- | ----------- |
| 50 | Access denied  | The client application is not authorised to call this resource.|
| 52 | Forbidden user | The user has been blocked from calling this resource. |`,
        schema: ErrorRepresentation,
      },
      {
        status: 404,
        description: `Not Found

| Code | Status | Reason |
| ---- | ------- | ----------- |
|  60 |  Resource not found | The requested URI or resource does not exist. |`,
        schema: ErrorRepresentation,
      },
      {
        status: 405,
        description: `&lt;p&gt;Method Not Allowed&lt;/p&gt;

| Code | Message | Description |
 | ---- | ------- | ----------- |
 | 61 | Method not allowed | The requested method is not supported by this resource. |`,
        schema: ErrorRepresentation,
      },
      {
        status: 429,
        description: `&lt;p&gt;Too Many Requests&lt;/p&gt;

| Code | Message | Description |
| ---- | ------- | ----------- |
| 53 | Too many requests | When the application has made too many calls and has exceeded the rate limit for this service. |`,
        schema: ErrorRepresentation,
      },
      {
        status: 500,
        description: `&lt;p&gt;Internal Server Error OR Server Error&lt;/p&gt;

| Code | Message | Description |
| ---- | ------- | ----------- |
| 01 | Internal Error   | BT error code. |
| 02 | Internal error   | BT error code.|`,
        schema: ErrorRepresentation,
      },
      {
        status: 503,
        description: `&lt;p&gt;Service Unavailable&lt;/p&gt;

| Code | Message | Description |
 | ---- | ------- | ----------- |
 | 05 | The service is temporarily unavailable | Please try again later. |`,
        schema: ErrorRepresentation,
      },
      {
        status: 504,
        description: `&lt;p&gt;Gateway Timeout&lt;/p&gt;

 | Code | Message | Description |
 | ---- | ------- | ----------- |
 | 69 | Gateway Timeout | System timed out talking to downstream system. |`,
        schema: ErrorRepresentation,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}

export const btAddressApiSchema = z.array(GeographicAddress);

export type TBtApiAddress = z.infer<typeof GeographicAddress>;
export type TBtApiAddresses = z.infer<typeof btAddressApiSchema>;
