import express from "express";
import { userController } from "../../../controllers/index.controllers";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import {
  userUpdateSchema,
  passwordUpdateSchema,
  userSigninSchema,
  passwordResetSchema
} from "../../../validation/index.validation";
import {
  checkPermissions,
  validateRequest,
  requireAuth
} from "../../../middlewares/index.middlewares";

const profileRouter = express.Router();

profileRouter
  .route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"])),
    errorCatcher(userController.getProfile)
  )
  .post(
    errorCatcher(validateRequest("body", userSigninSchema)),
    errorCatcher(userController.signin)
  )
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"])),
    errorCatcher(validateRequest("body", userUpdateSchema)),
    errorCatcher(userController.updateUser)
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"])),
    errorCatcher(userController.deleteAccount)
  );

profileRouter
  .route("/changepw")
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"])),
    errorCatcher(validateRequest("body", passwordUpdateSchema)),
    errorCatcher(userController.changePassword)
  );

profileRouter
  .route("/resetpw")
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"])),
    errorCatcher(validateRequest("body", passwordResetSchema)),
    errorCatcher(userController.resetPassword)
  );

profileRouter.route("/logout").post(errorCatcher(userController.logout));

export default profileRouter;
