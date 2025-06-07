import express from "express";
import authRouter from "./auth/auth.router";
import usersRouter from "./user/users.router";
import decksRouter from "./deck/decks.router";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/decks", decksRouter);

export default apiRouter;
