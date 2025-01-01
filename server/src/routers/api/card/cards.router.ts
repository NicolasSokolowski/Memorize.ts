import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth } from "../../../middlewares/requireAuth.helper";
import { cardController } from "../../../controllers/index.controllers";

const cardsRouter = express.Router();

cardsRouter
  .route("/")
  .post(errorCatcher(requireAuth), errorCatcher(cardController.create));

export default cardsRouter;
