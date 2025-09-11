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
import { EmailService } from "../services/EmailService";
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
      throw new NotFoundError("User not found", "USER_NOT_FOUND");
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
      throw new BadRequestError(
        "Provided email is already in use",
        "EMAIL_ALREADY_EXISTS",
        "email"
      );
    }

    try {
      await this.datamapper.pool.query("BEGIN");
      const hashedPassword = await Password.toHash(password);

      if (!hashedPassword) {
        throw new BadRequestError(
          "The password could not be hashed",
          "PASSWORD_ERROR"
        );
      }

      const default_role = await roleDatamapper.findByPk(2);

      if (!default_role) {
        throw new NotFoundError("Role not found", "ROLE_NOT_FOUND");
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

      await EmailService.sendEmail({
        to: newUser.email,
        subject: "Création de compte",
        template: "accountCreation",
        context: { username: newUser.username }
      });

      const {
        password: returnedPassword,
        created_at,
        updated_at,
        ...user
      } = newUser;

      await this.datamapper.pool.query("COMMIT");
      res.status(201).send({ user: user });
    } catch (err) {
      console.error(err);
      await this.datamapper.pool.query("ROLLBACK");
      res
        .status(400)
        .json({ success: false, errors: [{ message: err.message }] });
    }
  };

  signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await this.datamapper.findBySpecificField("email", email);

    if (!user) {
      throw new BadRequestError(
        "Incorrect password or email",
        "CREDENTIALS_ERROR"
      );
    }

    const isPasswordValid = await Password.compare(user.password, password);

    if (!isPasswordValid) {
      throw new BadRequestError(
        "Incorrect password or email",
        "CREDENTIALS_ERROR"
      );
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
      throw new BadRequestError("Refresh token must be set", "INVALID_SECRET");
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

    const user = await this.datamapper.findBySpecificField(
      this.field,
      userEmail
    );

    if (!user) {
      throw new NotFoundError("User not found", "USER_NOT_FOUND");
    }

    if (data.email) {
      const checkIfEmailExists = await this.datamapper.findBySpecificField(
        this.field,
        data.email
      );

      if (checkIfEmailExists) {
        throw new BadRequestError(
          "Provided email is already used",
          "EMAIL_ALREADY_EXISTS",
          "email"
        );
      }
    } else {
      data.email = user.email;
    }

    data.password = user.password;

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
      throw new BadRequestError(
        "You should provide a valid id",
        "INVALID_PARAMETER"
      );
    }

    const user = await this.datamapper.findByPk(userId);

    if (!user) {
      throw new NotFoundError("User not found", "USER_NOT_FOUND");
    }

    const role = await roleController.datamapper.findBySpecificField(
      "name",
      roleName
    );

    if (!role) {
      throw new NotFoundError("Role not found", "USER_NOT_FOUND");
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
      throw new NotFoundError("User not found", "USER_NOT_FOUND");
    }

    try {
      await this.datamapper.pool.query("BEGIN");

      const isCurrentPasswordValid = await Password.compare(
        user.password,
        currentPassword
      );

      if (!isCurrentPasswordValid) {
        throw new BadRequestError(
          "Current password is incorrect",
          "INVALID_CURRENT_PASSWORD",
          "currentPassword"
        );
      }

      const hashedNewPassword = await Password.toHash(newPassword);

      if (!hashedNewPassword) {
        throw new BadRequestError(
          "The new password could not be hashed",
          "PASSWORD_HASH_ERROR"
        );
      }

      const updatedPassword = await this.datamapper.updatePassword(
        hashedNewPassword,
        userEmail
      );

      if (!updatedPassword) {
        throw new DatabaseConnectionError();
      }

      await EmailService.sendEmail({
        to: user.email,
        subject: "Modification de votre mot de passe",
        template: "userModification",
        context: { username: user.username, object: "mot de passe" }
      });
      await this.datamapper.pool.query("COMMIT");
      const { password, ...userWithoutPassword } = updatedPassword;

      res.status(200).send({ user: userWithoutPassword });
    } catch (err) {
      console.error(err);
      await this.datamapper.pool.query("ROLLBACK");
      res
        .status(400)
        .json({ success: false, errors: [{ message: err.message }] });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const userEmail = req.user?.email;
    const { newPassword, passwordConfirmation } = req.body;

    if (newPassword !== passwordConfirmation) {
      throw new BadRequestError(
        "New password and confirmation password are different",
        "CREDENTIALS_ERROR"
      );
    }

    const user = await this.datamapper.findBySpecificField(
      this.field,
      userEmail
    );

    if (!user) {
      throw new NotFoundError("User not found", "USER_NOT_FOUND");
    }

    try {
      await this.datamapper.pool.query("BEGIN");
      const hashedNewPassword = await Password.toHash(newPassword);

      if (!hashedNewPassword) {
        throw new BadRequestError(
          "The new password could not be hashed",
          "PASSWORD_ERROR"
        );
      }

      const updatedPassword = await this.datamapper.updatePassword(
        hashedNewPassword,
        userEmail
      );

      if (!updatedPassword) {
        throw new DatabaseConnectionError();
      }

      await EmailService.sendEmail({
        to: user.email,
        subject: "Modification de votre mot de passe",
        template: "userModification",
        context: { username: user.username, object: "mot de passe" }
      });
      await this.datamapper.pool.query("COMMIT");

      const { password, ...userWithoutPassword } = updatedPassword;

      res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });

      res.status(200).send({ user: userWithoutPassword });
    } catch (err) {
      console.error(err);
      await this.datamapper.pool.query("ROLLBACK");
      res
        .status(400)
        .json({ success: false, errors: [{ message: err.message }] });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    res.sendStatus(204);
  };

  deleteAccount = async (req: Request, res: Response): Promise<void> => {
    const userEmail = req.user?.email;

    const user = await this.datamapper.findBySpecificField(
      this.field,
      userEmail
    );

    if (!user) {
      throw new NotFoundError("User not found", "USER_NOT_FOUND");
    }

    const deletedUser = await this.datamapper.delete(user.id);

    if (!deletedUser) {
      throw new DatabaseConnectionError();
    }

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    res.status(200).send({ message: "Account deleted successfully" });
  };

  checkIfEmailIsAvailable = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { newEmail } = req.body;

    const checkIfEmailExists = await this.datamapper.findBySpecificField(
      "email",
      newEmail
    );

    if (checkIfEmailExists) {
      throw new BadRequestError("Email already used", "EMAIL_ALREADY_EXISTS");
    }

    res.status(200).json({ success: true });
  };
}
