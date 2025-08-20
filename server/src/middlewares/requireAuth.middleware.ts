import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError, BadRequestError } from "../errors/index.errors";
import { UserPayload, Token } from "../helpers/index.helpers";

declare module "express" {
  interface Request {
    user?: UserPayload;
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies["access_token"];

  if (!accessToken) {
    throw new NotAuthorizedError();
  } else if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new BadRequestError(
      "Access token secret must be set",
      "INVALID_SECRET"
    );
  }

  try {
    const decodedToken = await Token.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    req.user = decodedToken;

    next();
  } catch (err) {
    console.error("Access token verification failed: ", err);
    throw new NotAuthorizedError();
  }
};
