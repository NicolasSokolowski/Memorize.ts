import { CustomError } from "./CustomError.error";

export class NotFoundError extends CustomError {
  statusCode = 404;
  code = "NOT_FOUND";

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, code: this.code }];
  }
}
