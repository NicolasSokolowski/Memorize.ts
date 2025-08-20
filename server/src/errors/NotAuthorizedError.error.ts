import { CustomError } from "./CustomError.error";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  code = "UNAUTHORIZED";

  constructor(message = "Not authorized") {
    super(message);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, code: this.code }];
  }
}
