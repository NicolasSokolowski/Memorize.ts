import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { userController } from "../../../controllers/index.controllers";
import roleRouter from "./role.router";
import { requireAuth } from "../../../middlewares/requireAuth.helper";
import userRouter from "./user.router";

const usersRouter = express.Router();

usersRouter
  .route("/")
  .get(errorCatcher(requireAuth), errorCatcher(userController.getAll))
  .post(errorCatcher(userController.signup));

usersRouter.use("/role", roleRouter);
usersRouter.use("/:user_id", userRouter);

export default usersRouter;
