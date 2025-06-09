import express from "express";
import { userController } from "../../../controllers/index.controllers";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import {
  userUpdateSchema,
  passwordUpdateSchema
} from "../../../validation/index.validation";
import {
  checkPermissions,
  validateRequest,
  requireAuth
} from "../../../middlewares/index.middlewares";

const userRouter = express.Router();

userRouter
  .route("/")
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"])),
    errorCatcher(validateRequest("body", userUpdateSchema)),
    errorCatcher(userController.update)
  );

userRouter
  .route("/changepw")
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"])),
    errorCatcher(validateRequest("body", passwordUpdateSchema)),
    errorCatcher(userController.changePassword)
  );

export default userRouter;
