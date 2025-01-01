import express from "express";
import authRouter from "./auth/auth.router";
import usersRouter from "./user/users.router";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);

export default apiRouter;
