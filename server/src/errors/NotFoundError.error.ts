import { CustomError } from "./CustomError.error";

export class NotFoundError extends CustomError {
  statusCode = 404;
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, code: this.code }];
  }
}
