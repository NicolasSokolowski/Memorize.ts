import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import {
  requireAuth,
  checkPermissions,
  validateRequest
} from "../../../middlewares/index.middlewares";
import { deckController } from "../../../controllers/index.controllers";
import cardsRouter from "../card/cards.router";
import { deckUpdateSchema } from "../../../validation/index.validation";

const deckRouter = express.Router({ mergeParams: true });

deckRouter
  .route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "deck")),
    errorCatcher(deckController.getByPk)
  )
  .put(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "deck")),
    errorCatcher(validateRequest("body", deckUpdateSchema)),
    errorCatcher(deckController.update)
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "deck")),
    errorCatcher(deckController.delete)
  );

deckRouter.use("/cards", cardsRouter);

export default deckRouter;
