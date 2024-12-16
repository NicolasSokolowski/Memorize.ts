import express from "express";
import authRouter from "./auth/auth.router";
import userRouter from "./user/user.router";
import deckRouter from "./deck/deck.router";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/decks", deckRouter);

export default apiRouter;
