import { ErrorRequestHandler } from "express";
import { CustomError } from "../errors/CustomError.error";
import { UserPayload } from "../helpers/UserPayload.helper";

declare module "express" {
  interface Request {
    user?: UserPayload;
  }
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
    return;
  }

  console.error(err);
  res.status(400).send({
    errors: [{ message: "Something went wrong" }]
  });
};
