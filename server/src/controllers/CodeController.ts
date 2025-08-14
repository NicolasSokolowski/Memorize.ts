import { Request, Response } from "express";
import { CodeData } from "../datamappers/interfaces/CodeDatamapperReq";
import { CoreController } from "./CoreController";
import { CodeControllerReq } from "./interfaces/CodeControllerReq";
import {
  BadRequestError,
  DatabaseConnectionError,
  NotFoundError
} from "../errors/index.errors";
import {
  roleDatamapper,
  userDatamapper
} from "../datamappers/index.datamappers";
import { EmailService } from "../services/EmailService";
import crypto from "crypto";
import { UserData } from "../datamappers/interfaces/UserDatamapperReq";
import { Token } from "../helpers/Token";

interface EmailChangePayload {
  data: {
    newEmail: string;
  };
}

type RequestPayloads = {
  EMAIL_CHANGE: EmailChangePayload;
  ACCOUNT_DELETE: null;
};

export class CodeController extends CoreController<
  CodeControllerReq,
  CodeData
> {
  constructor(datamapper: CodeControllerReq["datamapper"]) {
    const field = "code";
    super(datamapper, field);

    this.datamapper = datamapper;
  }

  sendVerificationCode = async (req: Request, res: Response): Promise<void> => {
    const userEmail = req.user?.email;
    const { requestType, subject } = req.body;

    const user = await userDatamapper.findBySpecificField("email", userEmail);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const checkIfRequestAlreadyExists = await this.datamapper.checkCompositeKey(
      requestType,
      user.id
    );

    if (checkIfRequestAlreadyExists) {
      const deletedCode = await this.datamapper.delete(
        checkIfRequestAlreadyExists.id
      );

      if (!deletedCode) {
        throw new DatabaseConnectionError();
      }
    }

    try {
      await this.datamapper.pool.query("BEGIN");

      const generatedCode = String(Math.floor(Math.random() * 10000)).padStart(
        4,
        "0"
      );
      const expiration = new Date(Date.now() + 15 * 60 * 1000);

      const code = {
        code: generatedCode,
        user_id: user.id,
        request_type: requestType,
        expiration
      };

      const createdCode = await this.datamapper.insert(code);

      if (!createdCode) {
        throw new DatabaseConnectionError();
      }

      await EmailService.sendEmail({
        to: userEmail,
        subject,
        template: "verification",
        context: {
          username: user.username,
          request: subject.toLowerCase(),
          numberOne: generatedCode[0],
          numberTwo: generatedCode[1],
          numberThree: generatedCode[2],
          numberFour: generatedCode[3]
        }
      });

      await this.datamapper.pool.query("COMMIT");

      res.status(201).json({ success: true });
    } catch (err) {
      console.error(err);
      await this.datamapper.pool.query("ROLLBACK");
      throw new BadRequestError(
        "Error while trying to send verification code."
      );
    }
  };

  verifyCodeValidity = async (req: Request, res: Response): Promise<void> => {
    const { requestType } = req.body;

    try {
      await this.datamapper.pool.query("BEGIN");

      const { user } = await this.verifyCode(req);

      const handler = this.actionMap[requestType];

      if (!handler) {
        throw new BadRequestError("Unknown request type");
      }

      const result = await handler(user, req.body, res);

      await this.datamapper.pool.query("COMMIT");

      res.status(200).json({ ...result });
    } catch (err) {
      await this.datamapper.pool.query("ROLLBACK");
      res
        .status(400)
        .json({ success: false, errors: [{ message: err.message }] });
    }
  };

  private verifyCode = async (req: Request) => {
    const userEmail = req.user.email;
    const { requestType, code } = req.body;

    const user = await userDatamapper.findBySpecificField("email", userEmail);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const storedCode = await this.datamapper.checkCompositeKey(
      requestType,
      user.id
    );

    if (!storedCode) {
      throw new NotFoundError("Code not found");
    }

    if (new Date() > storedCode.expiration) {
      throw new BadRequestError("Code has expired.");
    }

    const providedBuffer = Buffer.from(code);
    const storedBuffer = Buffer.from(storedCode.code);

    if (
      providedBuffer.length !== storedBuffer.length ||
      !crypto.timingSafeEqual(providedBuffer, storedBuffer)
    ) {
      throw new BadRequestError("Invalid code.");
    }

    const deletedCode = await this.datamapper.delete(storedCode.id);

    if (!deletedCode) {
      throw new DatabaseConnectionError();
    }

    return { user };
  };

  private actionMap: {
    [K in keyof RequestPayloads]: (
      user: UserData,
      body: RequestPayloads[K],
      res?: Response
    ) => Promise<Partial<{ email: string; success: boolean }>>;
  } = {
    EMAIL_CHANGE: async (user, { data }, res) => {
      const updatedUser = await userDatamapper.update(
        { ...user, email: data.newEmail },
        user.email
      );
      await EmailService.sendEmail({
        to: data.newEmail,
        subject: "Modification de votre adresse e-mail",
        template: "userModification",
        context: { username: user.username, object: "adresse e-mail" }
      });
      const userRole = await roleDatamapper.findByPk(user.role_id);
      const userPayload = {
        email: updatedUser.email,
        role: userRole.name
      };

      const accessToken = await Token.generateAccessToken(userPayload);

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });
      return { email: updatedUser.email };
    },
    ACCOUNT_DELETE: async (user, _, res) => {
      await userDatamapper.delete(user.id);
      await EmailService.sendEmail({
        to: user.email,
        subject: "Suppression de votre adresse e-mail",
        template: "accountDeletion",
        context: { username: user.username }
      });

      res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });
      return { success: true };
    }
  };
}
