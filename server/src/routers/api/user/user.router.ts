import express from "express";
import decksRouter from "../deck/decks.router";

const userRouter = express.Router({ mergeParams: true });

userRouter.use("/decks", decksRouter);

export default userRouter;
