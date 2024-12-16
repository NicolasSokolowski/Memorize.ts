import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { userController } from "../../../controllers/index.controllers";
import roleRouter from "./role.router";
import { requireAuth } from "../../../middlewares/requireAuth.helper";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(errorCatcher(requireAuth), errorCatcher(userController.getAll))
  .post(errorCatcher(userController.signup));

userRouter.use("/role", roleRouter);

export default userRouter;
