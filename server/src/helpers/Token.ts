import { BadRequestError } from "../errors/BadRequestError.error";
import { UserPayload } from "./UserPayload.helper";
import jwt from "jsonwebtoken";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export class Token {
  static generateAccessToken = async ({ id, email, role }: UserPayload) => {
    const user = { id, email, role };

    if (!ACCESS_TOKEN_SECRET) {
      throw new BadRequestError("Access token secret must be set.");
    }

    const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return accessToken;
  };

  static generateRefreshToken = async ({ id, email, role }: UserPayload) => {
    const user = { id, email, role };

    if (!REFRESH_TOKEN_SECRET) {
      throw new BadRequestError("Refresh token secret must be set.");
    }

    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    return refreshToken;
  };

  static verify = async (
    token: string,
    secret: string
  ): Promise<UserPayload> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as UserPayload);
        }
      });
    });
  };
}
