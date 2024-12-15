import express from "express";
import authRouter from "./auth/auth.router";
import userRouter from "./user/user.router";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);

export default apiRouter;
