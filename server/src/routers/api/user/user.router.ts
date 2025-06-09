import express from "express";
import { userController } from "../../../controllers/index.controllers";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import userUpdateSchema from "../../../validation/schemas/user/user.update.schema";
import {
  checkPermissions,
  validateRequest,
  requireAuth
} from "../../../middlewares/index.middlewares";

const userRouter = express.Router({ mergeParams: true });

userRouter
  .route("/")
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"])),
    errorCatcher(validateRequest("body", userUpdateSchema)),
    errorCatcher(userController.update)
  );

export default userRouter;
