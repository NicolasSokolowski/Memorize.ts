import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth } from "../../../middlewares/requireAuth.helper";
import { deckController } from "../../../controllers/index.controllers";
import { checkPermissions } from "../../../middlewares/checkPermissions.middleware";
import deckRouter from "./deck.router";

const decksRouter = express.Router();

decksRouter
  .route("/")
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "user")),
    errorCatcher(deckController.create)
  );

decksRouter.use("/:deck_id", deckRouter);

export default decksRouter;
