import { CustomError } from "./CustomError.error";

export class BadRequestError extends CustomError {
  statusCode = 400;
  private field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.field = field;

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [
      this.field
        ? { message: this.message, field: this.field }
        : { message: this.message }
    ];
  }
}
