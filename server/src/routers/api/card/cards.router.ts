import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import {
  requireAuth,
  checkPermissions,
  validateRequest
} from "../../../middlewares/index.middlewares";
import { cardController } from "../../../controllers/index.controllers";
import cardRouter from "./card.router";
import { cardCreateSchema } from "../../../validation/index.validation";

const cardsRouter = express.Router({ mergeParams: true });

cardsRouter
  .route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "deck")),
    errorCatcher(cardController.getAllCardsByDeckId)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "deck")),
    errorCatcher(validateRequest("body", cardCreateSchema)),
    errorCatcher(cardController.create)
  );

cardsRouter.use("/:card_id", cardRouter);

export default cardsRouter;
