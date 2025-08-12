import { Request, Response } from "express";
import { CodeData } from "../datamappers/interfaces/CodeDatamapperReq";
import { CoreController } from "./CoreController";
import { CodeControllerReq } from "./interfaces/CodeControllerReq";
import {
  BadRequestError,
  DatabaseConnectionError,
  NotFoundError
} from "../errors/index.errors";
import { userDatamapper } from "../datamappers/index.datamappers";
import { EmailService } from "../services/EmailService";
import crypto from "crypto";

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
    const userEmail = req.user.email;
    const { requestType, code, newEmail, subject } = req.body;

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

    const date = new Date();

    if (date > storedCode.expiration) {
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

    try {
      await this.datamapper.pool.query("BEGIN");

      const deletedCode = await this.datamapper.delete(storedCode.id);

      if (!deletedCode) {
        throw new DatabaseConnectionError();
      }

      const userData = {
        ...user,
        email: newEmail
      };

      const updatedUser = await userDatamapper.update(userData, userEmail);

      if (!updatedUser) {
        throw new DatabaseConnectionError();
      }

      await EmailService.sendEmail({
        to: newEmail,
        subject,
        template: "emailModification",
        context: {
          username: user.username
        }
      });

      await this.datamapper.pool.query("COMMIT");
    } catch (err) {
      console.error(err);
      await this.datamapper.pool.query("ROLLBACK");
      throw new BadRequestError(
        "Error while trying to send email modification's confirmation email."
      );
    }

    res.status(200).json({ success: true });
  };
}
