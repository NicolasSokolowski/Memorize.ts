import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { userController } from "../../../controllers/index.controllers";
import roleRouter from "./role.router";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(errorCatcher(userController.getAll))
  .post(errorCatcher(userController.signup));

userRouter.use("/role", roleRouter);

export default userRouter;
