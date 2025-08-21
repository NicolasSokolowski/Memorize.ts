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
import {
  verifyCodeSchema,
  sendCodeSchema
} from "../../../validation/index.validation";

const authRouter = express.Router();

authRouter.route("/").post(errorCatcher(userController.signin));
authRouter.route("/refresh").post(errorCatcher(userController.refreshToken));

authRouter
  .route("/code/send")
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"])),
    errorCatcher(validateRequest("body", sendCodeSchema)),
    errorCatcher(codeController.sendVerificationCode)
  );

authRouter
  .route("/code/send/reset")
  .post(
    errorCatcher(validateRequest("body", sendCodeSchema)),
    errorCatcher(codeController.sendVerificationCode)
  );

authRouter
  .route("/code/check")
  .post(
    errorCatcher(validateRequest("body", verifyCodeSchema)),
    errorCatcher(codeController.verifyCodeValidity)
  );

export default authRouter;
