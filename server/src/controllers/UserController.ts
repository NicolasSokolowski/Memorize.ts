import { UserDatamapperReq } from "../datamappers/interfaces/UserDatamapperReq";
import { BadRequestError, NotAuthorizedError } from "../errors/index.errors";
import { Password } from "../helpers/Password";
import { Token } from "../helpers/Token";
import { CoreController } from "./CoreController";
import { UserControllerReq } from "./interfaces/UserControllerReq";
import { Request, Response } from "express";

export class UserController extends CoreController<
  UserControllerReq,
  UserDatamapperReq
> {
  constructor(datamapper: UserControllerReq["datamapper"]) {
    const field = "email";
    super(datamapper, field);

    this.datamapper = datamapper;
  }

  signup = async (req: Request, res: Response): Promise<void> => {
    const { email, password, username } = req.body;

    const hashedPassword = await Password.toHash(password);

    if (!hashedPassword) {
      throw new BadRequestError("The password could not be hashed");
    }

    const role_id = 2;

    const newUserData = {
      email,
      password: hashedPassword,
      username,
      role_id,
    };

    const newUser = await this.datamapper.insert(newUserData);

    const {
      password: returnedPassword,
      created_at,
      updated_at,
      ...user
    } = newUser;

    res.status(201).send({ user: user });
  };

  refreshToken = async (req: Request, res: Response) => {
    const { REFRESH_TOKEN_SECRET } = process.env;
    const refreshToken = req.headers["x-refresh-token"] as string;

    if (!refreshToken) {
      throw new NotAuthorizedError();
    }

    if (!REFRESH_TOKEN_SECRET) {
      throw new BadRequestError("Refresh token must be set");
    }

    try {
      const decodedToken = await Token.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET
      );

      const newAccessToken = await Token.generateAccessToken(decodedToken);

      res.status(200).send({ accessToken: newAccessToken });
    } catch (err) {
      console.error(err);
      throw new NotAuthorizedError();
    }
  };
}
