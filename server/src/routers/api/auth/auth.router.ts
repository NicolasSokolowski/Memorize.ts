import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { userController } from "../../../controllers/index.controllers";

const authRouter = express.Router();

authRouter.route("/").post(errorCatcher(userController.signin));
authRouter.route("/refresh").post(errorCatcher(userController.refreshToken));

export default authRouter;
