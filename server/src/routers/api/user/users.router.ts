import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { userController } from "../../../controllers/index.controllers";
import roleRouter from "./role.router";
import {
  requireAuth,
  validateRequest,
} from "../../../middlewares/index.middlewares";
import userRouter from "./user.router";
import { userCreateSchema } from "../../../validation/index.validation";

const usersRouter = express.Router();

usersRouter
  .route("/")
  .get(errorCatcher(requireAuth), errorCatcher(userController.getAll))
  .post(
    errorCatcher(requireAuth),
    errorCatcher(validateRequest("body", userCreateSchema)),
    errorCatcher(userController.signup)
  );

usersRouter.use("/role", roleRouter);
usersRouter.use("/:user_id", userRouter);

export default usersRouter;
