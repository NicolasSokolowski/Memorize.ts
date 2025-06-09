import express from "express";
import authRouter from "./auth/auth.router";
import usersRouter from "./user/users.router";
import decksRouter from "./deck/decks.router";
import userRouter from "./user/user.router";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/profile", userRouter);
apiRouter.use("/decks", decksRouter);

export default apiRouter;
