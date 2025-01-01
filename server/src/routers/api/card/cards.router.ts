import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth } from "../../../middlewares/requireAuth.helper";
import { cardController } from "../../../controllers/index.controllers";
import { checkPermissions } from "../../../middlewares/checkPermissions.middleware";
import cardRouter from "./card.router";

const cardsRouter = express.Router({ mergeParams: true });

cardsRouter
  .route("/")
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "deck")),
    errorCatcher(cardController.create)
  );

cardsRouter.use("/:card_id", cardRouter);

export default cardsRouter;
