import { roleDatamapper } from "../datamappers/index.datamappers";
import { UserDatamapperReq } from "../datamappers/interfaces/UserDatamapperReq";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from "../errors/index.errors";
import { Password } from "../helpers/Password";
import { Token } from "../helpers/Token";
import { CoreController } from "./CoreController";
import { roleController } from "./index.controllers";
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

    const default_role = await roleDatamapper.findByPk(2);

    const newUserData = {
      email,
      password: hashedPassword,
      username,
      role_id: default_role.id,
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

  signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Please provide an email and a password");
    }

    const user = await this.datamapper.findBySpecificField("email", email);

    if (!user) {
      throw new NotFoundError();
    }

    const checkPassword = await Password.compare(user.password, password);

    if (!checkPassword) {
      throw new BadRequestError("Incorrect password");
    }

    const default_role = await roleController.datamapper.findByPk(2);
    const role = default_role.name;

    const userPayload = {
      email: user.email,
      role,
    };

    const accessToken = await Token.generateAccessToken(userPayload);
    const refreshToken = await Token.generateRefreshToken(userPayload);

    const {
      password: returnedPassword,
      role_id,
      created_at,
      updated_at,
      ...signedUser
    } = user;

    const returnedUser = {
      ...signedUser,
      role,
    };

    res
      .status(201)
      .send({ user: returnedUser, tokens: { accessToken, refreshToken } });
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
