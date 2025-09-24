import { mapErrorToCustomError } from "./error-mapper";
import { ZodError } from "zod";
import { Context } from "hono";
import { CustomError } from "src/app/lib/schemas/errors/custom-error";

describe("mapErrorToCustomError", () => {
  let mockContext: Partial<Context>;
  let mockLogger: { error: jest.Mock };

  beforeEach(() => {
    mockLogger = {
      error: jest.fn(),
    };
    mockContext = {
      get: jest.fn().mockReturnValue(mockLogger),
    };
  });

  it("should handle BT API errors", () => {
    const btError = {
      isAxiosError: true, // Add this
      response: {
        data: {
          message: "BT API Error",
          code: 123,
        },
        request: {
          host: "api.wholesale.bt.com",
        },
      },
      status: 400, // Moved status here
    };

    const result = mapErrorToCustomError(btError, mockContext as Context);

    expect(result).toEqual({
      statusCode: 502,
      error: {
        message: "Something went wrong on BT's end. try again later.",
        btError: {
          message: "BT API Error",
          code: 123,
          statusCode: 400,
        },
      },
    });
    expect(mockLogger.error).toHaveBeenCalledWith(
      { err: btError },
      "BT API Error occurred"
    );
  });

  it("should handle CustomError", () => {
    const customError = new CustomError({
      message: "Custom error message",
      source: "test source",
    });

    const result = mapErrorToCustomError(customError, mockContext as Context);

    expect(result).toEqual({
      statusCode: 500,
      error: {
        message: "Custom error message",
        source: "test source",
      },
    });
    expect(mockLogger.error).toHaveBeenCalledWith(
      { err: customError },
      "Internal Server Error"
    );
  });

  it("should handle ZodError", () => {
    const zodError = new ZodError([
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: ["field"],
        message: "Expected string, received number",
      },
    ]);

    const result = mapErrorToCustomError(zodError, mockContext as Context);

    expect(result).toEqual({
      statusCode: 406,
      error: {
        message: "Zod error",
        zodError: zodError.errors[0],
      },
    });
    expect(mockLogger.error).toHaveBeenCalledWith(
      { err: zodError },
      "ZOD error"
    );
  });

  it("should handle unknown errors", () => {
    const unknownError = new Error("Unknown error");

    const result = mapErrorToCustomError(unknownError, mockContext as Context);

    expect(result).toEqual({
      statusCode: 500,
      error: {
        message: "Internal Server Error",
      },
    });
    expect(mockLogger.error).toHaveBeenCalledWith(
      { err: unknownError },
      "Unknown error"
    );
  });
});
