import { CustomError } from "./CustomError.error";

export class NotFoundError extends CustomError {
  statusCode = 404;
  private field?: string;

  constructor(message?: string, field?: string) {
    super(message || "Route not found");
    this.field = field;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [
      this.field
        ? { message: this.message, field: this.field }
        : { message: this.message }
    ];
  }
}
