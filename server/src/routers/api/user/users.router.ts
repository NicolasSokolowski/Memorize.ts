import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { userController } from "../../../controllers/index.controllers";
import roleRouter from "./role.router";
import {
  requireAuth,
  validateRequest,
  checkPermissions
} from "../../../middlewares/index.middlewares";
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
    errorCatcher(validateRequest("body", userCreateSchema)),
    errorCatcher(userController.signup)
  );

usersRouter
  .route("/:user_id")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(userController.getByPk)
  );

usersRouter.use("/role", roleRouter);

export default usersRouter;
