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

      if (err.type === "any.required") {
        return { message: `Missing field ${err.path}`, field, code: this.code };
      }

      return { message: err.message, code: this.code, field };
    });
  }
}
