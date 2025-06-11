import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { userController } from "../../../controllers/index.controllers";
import rolesRouter from "../role/roles.router";
import {
  requireAuth,
  validateRequest,
  checkPermissions
} from "../../../middlewares/index.middlewares";
import { userCreateSchema } from "../../../validation/index.validation";
import userRouter from "./user.router";

const usersRouter = express.Router();

usersRouter
  .route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(userController.getAll)
  )
  .post(
    errorCatcher(validateRequest("body", userCreateSchema)),
    errorCatcher(userController.signup)
  );

usersRouter.use("/:user_id", userRouter);
usersRouter.use("/roles", rolesRouter);

export default usersRouter;
