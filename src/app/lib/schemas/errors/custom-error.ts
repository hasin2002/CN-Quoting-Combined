import { z } from "zod";

export const customErrorSchema = z.object({
  message: z.string(),
  source: z.string(),
});

export type TCustomError = z.infer<typeof customErrorSchema>;

export class CustomError extends Error implements TCustomError {
  message: string;
  source: string;

  constructor(params: TCustomError) {
    // Validate the input parameters against the Zod schema
    const validation = customErrorSchema.safeParse(params);

    super(params.message); // Call the parent Error class constructor

    // Assign validated properties
    this.message = params.message;
    this.source = params.source;

    // Restore the prototype chain (necessary for instanceof checks)
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  // Implement toJSON for consistent serialization
  toJSON() {
    return {
      message: this.message,
      source: this.source,
    };
  }
}
