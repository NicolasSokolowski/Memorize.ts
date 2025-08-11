import express from "express";
import { errorCatcher } from "../../../helpers/index.helpers";
import {
  codeController,
  userController
} from "../../../controllers/index.controllers";
import {
  checkPermissions,
  validateRequest,
  requireAuth
} from "../../../middlewares/index.middlewares";
import codeSendCodeSchema from "../../../validation/schemas/code/code.sendCode.schema";

const authRouter = express.Router();

authRouter.route("/").post(errorCatcher(userController.signin));
authRouter.route("/refresh").post(errorCatcher(userController.refreshToken));

authRouter
  .route("/code/send")
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"])),
    errorCatcher(validateRequest("body", codeSendCodeSchema)),
    errorCatcher(codeController.sendVerificationCode)
  );

export default authRouter;
