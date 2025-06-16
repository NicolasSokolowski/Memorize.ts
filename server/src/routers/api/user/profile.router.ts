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

const profileRouter = express.Router();

profileRouter
  .route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"])),
    errorCatcher(userController.getProfile)
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

export default profileRouter;
