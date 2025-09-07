import { CustomError } from "./CustomError.error";

export class BadRequestError extends CustomError {
  statusCode = 400;
  code: string;
  field?: string;

  constructor(message: string, code: string, field?: string) {
    super(message);
    this.code = code;
    this.field = field;

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, code: this.code, field: this.field }];
  }
}
