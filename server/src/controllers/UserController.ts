import { roleDatamapper } from "../datamappers/index.datamappers";
import { UserData } from "../datamappers/interfaces/UserDatamapperReq";
import {
  BadRequestError,
  DatabaseConnectionError,
  NotAuthorizedError,
  NotFoundError
} from "../errors/index.errors";
import { Password } from "../helpers/Password";
import { Token } from "../helpers/Token";
import { CoreController } from "./CoreController";
import { roleController } from "./index.controllers";
import { UserControllerReq } from "./interfaces/UserControllerReq";
import { Request, Response } from "express";

export class UserController extends CoreController<
  UserControllerReq,
  UserData
> {
  constructor(datamapper: UserControllerReq["datamapper"]) {
    const field = "email";
    super(datamapper, field);

    this.datamapper = datamapper;
  }

  getProfile = async (req: Request, res: Response): Promise<void> => {
    const userEmail = req.user?.email;

    const user = await this.datamapper.findBySpecificField(
      this.field,
      userEmail
    );

    if (!user) {
      throw new NotFoundError();
    }

    const { password, created_at, updated_at, ...userWithoutPassword } = user;

    res.status(200).send({ user: userWithoutPassword });
  };

  signup = async (req: Request, res: Response): Promise<void> => {
    const { email, password, username } = req.body;

    const isEmailUsed = await this.datamapper.findBySpecificField(
      this.field,
      email
    );

    if (isEmailUsed) {
      throw new BadRequestError("Provided email is already in use.", "email");
    }

    const hashedPassword = await Password.toHash(password);

    if (!hashedPassword) {
      throw new BadRequestError("The password could not be hashed", "password");
    }

    const default_role = await roleDatamapper.findByPk(2);

    if (!default_role) {
      throw new NotFoundError();
    }

    const newUserData = {
      email,
      password: hashedPassword,
      username,
      role_id: default_role.id
    };

    const newUser = await this.datamapper.insert(newUserData);

    if (!newUser) {
      throw new DatabaseConnectionError();
    }

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
      throw new BadRequestError("Incorrect password or email.");
    }

    const user = await this.datamapper.findBySpecificField("email", email);

    if (!user) {
      throw new NotFoundError();
    }

    const isPasswordValid = await Password.compare(user.password, password);

    if (!isPasswordValid) {
      throw new BadRequestError("Incorrect password or email.");
    }

    const default_role = await roleController.datamapper.findByPk(2);
    const role = default_role.name;

    // Update user last login date
    user.last_login = new Date();
    const updatedUser = await this.datamapper.updateLastLogin(
      user.last_login.toISOString(),
      user.email
    );

    if (!updatedUser) {
      throw new DatabaseConnectionError();
    }

    const userPayload = {
      email: user.email,
      role
    };

    // Generate tokens

    const accessToken = await Token.generateAccessToken(userPayload);
    const refreshToken = await Token.generateRefreshToken(userPayload);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    // Remove sensitive data before sending response
    delete user.password;

    const returnedUser = {
      ...user,
      role
    };

    res.status(200).send({ user: returnedUser });
  };

  refreshToken = async (req: Request, res: Response) => {
    const { REFRESH_TOKEN_SECRET } = process.env;
    const refreshToken = req.cookies["refresh_token"];

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

  updateUser = async (req: Request, res: Response): Promise<void> => {
    const userEmail = req.user?.email;
    const data = req.body;

    const checkIfEmailExists = await this.datamapper.findBySpecificField(
      this.field,
      data.email
    );

    if (checkIfEmailExists) {
      throw new BadRequestError(
        `Provided email is already in use. Please choose another one.`
      );
    }

    const user = await this.datamapper.findBySpecificField(
      this.field,
      userEmail
    );

    if (!user) {
      throw new NotFoundError();
    }

    data.password = user.password; // Preserve the existing password

    const updatedUser = await this.datamapper.update(data, userEmail);

    if (!updatedUser) {
      throw new DatabaseConnectionError();
    }

    const { password, created_at, updated_at, ...userWithoutPassword } =
      updatedUser;

    res.status(200).send({ user: userWithoutPassword });
  };

  updateUserRole = async (req: Request, res: Response): Promise<void> => {
    const userId: number = parseInt(req.params.user_id, 10);
    const { name: roleName } = req.body;

    if (!userId) {
      throw new BadRequestError("You should provide a valid id");
    }

    const user = await this.datamapper.findByPk(userId);

    if (!user) {
      throw new NotFoundError();
    }

    const role = await roleController.datamapper.findBySpecificField(
      "name",
      roleName
    );

    if (!role) {
      throw new NotFoundError();
    }

    const updatedUser = await this.datamapper.updateRole(userId, role.id);

    if (!updatedUser) {
      throw new DatabaseConnectionError();
    }

    const { password, ...userWithoutPassword } = updatedUser;

    res.status(200).send({ user: userWithoutPassword });
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    const userEmail = req.user?.email;
    const { currentPassword, newPassword } = req.body;

    const user = await this.datamapper.findBySpecificField(
      this.field,
      userEmail
    );

    if (!user) {
      throw new NotFoundError();
    }

    const isCurrentPasswordValid = await Password.compare(
      user.password,
      currentPassword
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestError("Current password is incorrect");
    }

    const hashedNewPassword = await Password.toHash(newPassword);

    if (!hashedNewPassword) {
      throw new BadRequestError("The new password could not be hashed");
    }

    const updatedPassword = await this.datamapper.updatePassword(
      hashedNewPassword,
      userEmail
    );

    if (!updatedPassword) {
      throw new DatabaseConnectionError();
    }

    const { password, ...userWithoutPassword } = updatedPassword;

    res.status(200).send({ user: userWithoutPassword });
  };

  deleteAccount = async (req: Request, res: Response): Promise<void> => {
    const userEmail = req.user?.email;

    const user = await this.datamapper.findBySpecificField(
      this.field,
      userEmail
    );

    if (!user) {
      throw new NotFoundError();
    }

    const deletedUser = await this.datamapper.delete(user.id);

    if (!deletedUser) {
      throw new DatabaseConnectionError();
    }

    res.status(200).send({ message: "Account deleted successfully" });
  };
}
