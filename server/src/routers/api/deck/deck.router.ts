import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth } from "../../../middlewares/requireAuth.helper";
import { deckController } from "../../../controllers/index.controllers";

const deckRouter = express.Router();

deckRouter
  .route("/")
  .post(errorCatcher(requireAuth), errorCatcher(deckController.create));

export default deckRouter;
