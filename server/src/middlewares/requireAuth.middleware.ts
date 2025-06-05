import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/NotAuthorizedError.error";
import { BadRequestError } from "../errors/BadRequestError.error";
import { Token } from "../helpers/Token";
import { UserPayload } from "../helpers/UserPayload.helper";

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
    throw new BadRequestError("Access token secret must be set");
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
