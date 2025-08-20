import { CustomError } from "./CustomError.error";

export class DatabaseConnectionError extends CustomError {
  message = "Error connecting to database";
  statusCode = 500;
  code = "DATABASE_ERROR";

  constructor() {
    super("Error connecting to database");

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, code: this.code }];
  }
}
