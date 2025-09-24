import { ZodError } from "zod";
import { isBtError } from "./is-bt-error";
import { Context } from "hono";
import { TMappedError } from "src/app/lib/schemas/errors/error-response-schema";
import { CustomError } from "src/app/lib/schemas/errors/custom-error";

export function mapErrorToCustomError(error: any, c: Context): TMappedError {
  const log = c.get("logger");

  if (isBtError(error)) {
    // Simplified dev logging
    log.error({ err: error }, "BT API Error occurred");

    return {
      statusCode: 502,
      error: {
        message: "Something went wrong on BT's end. try again later.",
        btError: {
          message: error.response.data.message,
          code: error.response.data.code,
          statusCode: error.status,
        },
      },
    };
  } else if (error instanceof CustomError) {
    log.error({ err: error }, "Internal Server Error");

    return {
      statusCode: 500,
      error: {
        message: error.message,
        source: error.source,
      },
    };
  } else if (error instanceof ZodError) {
    log.error({ err: error }, "ZOD error");

    return {
      statusCode: 406,
      error: {
        message: "Zod error",
        zodError: error.errors[0],
      },
    };
  } else {
    log.error({ err: error }, "Unknown error");

    return {
      statusCode: 500,
      error: {
        message: "Internal Server Error",
      },
    };
  }
}
