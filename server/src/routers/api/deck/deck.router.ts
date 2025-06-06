import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import {
  requireAuth,
  checkPermissions,
} from "../../../middlewares/index.middlewares";
import { deckController } from "../../../controllers/index.controllers";
import cardsRouter from "../card/cards.router";

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
    errorCatcher(deckController.update)
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "deck")),
    errorCatcher(deckController.delete)
  );

deckRouter.use("/cards", cardsRouter);

export default deckRouter;
