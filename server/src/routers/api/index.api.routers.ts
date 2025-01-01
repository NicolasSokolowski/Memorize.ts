import express from "express";
import authRouter from "./auth/auth.router";
import userRouter from "./user/user.router";
import decksRouter from "./deck/decks.router";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/decks", decksRouter);

export default apiRouter;
