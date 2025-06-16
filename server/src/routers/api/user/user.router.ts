import express from "express";
import { errorCatcher } from "../../../helpers/index.helpers";
import {
  checkPermissions,
  requireAuth,
  validateRequest
} from "../../../middlewares/index.middlewares";
import { userController } from "../../../controllers/index.controllers";
import { userRoleUpdateSchema } from "../../../validation/index.validation";

const userRouter = express.Router({ mergeParams: true });

userRouter
  .route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(userController.getByPk)
  )
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(validateRequest("body", userRoleUpdateSchema)),
    errorCatcher(userController.updateUserRole)
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(userController.delete)
  );

export default userRouter;
