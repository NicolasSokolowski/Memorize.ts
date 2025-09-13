import Joi from "joi";
import { CustomError } from "./CustomError.error";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  private field?: string;
  code = "VALIDATION_ERROR";

  constructor(
    public errors: Joi.ValidationErrorItem[],
    field?: string
  ) {
    super("Invalid request parameters");

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      const field = err.path?.[0] as string | undefined;

      return {
        message: err.message,
        code: this.code,
        field,
        type: err.type,
        context: err.context
      };
    });
  }
}
