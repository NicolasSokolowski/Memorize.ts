import { CustomError } from "./CustomError.error";

export class BadRequestError extends CustomError {
  statusCode = 400;
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, code: this.code }];
  }
}
