import Joi, { ValidationError } from "joi";
import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../errors/index.errors";

export const validateRequest =
  (sourceProperty: keyof Request, schema: Joi.Schema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req[sourceProperty], { abortEarly: false });
      next();
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        const field = (err.details[0].path[0] as string) || undefined;
        next(new RequestValidationError(err.details, field));
      } else {
        next(err);
      }
    }
  };
