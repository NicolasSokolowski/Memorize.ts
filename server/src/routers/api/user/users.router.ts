import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { userController } from "../../../controllers/index.controllers";
import roleRouter from "./role.router";
import {
  requireAuth,
  validateRequest,
  checkPermissions,
} from "../../../middlewares/index.middlewares";
import userRouter from "./user.router";
import { userCreateSchema } from "../../../validation/index.validation";

const usersRouter = express.Router();

usersRouter
  .route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(userController.getAll)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(validateRequest("body", userCreateSchema)),
    errorCatcher(userController.signup)
  );

usersRouter.use("/role", roleRouter);
usersRouter.use("/:user_id", userRouter);

export default usersRouter;
