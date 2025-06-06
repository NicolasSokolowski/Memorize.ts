import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import {
  requireAuth,
  checkPermissions,
} from "../../../middlewares/index.middlewares";
import { deckController } from "../../../controllers/index.controllers";
import deckRouter from "./deck.router";

const decksRouter = express.Router({ mergeParams: true });

decksRouter
  .route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "user")),
    errorCatcher(deckController.getAllDecksByUserId)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "user")),
    errorCatcher(deckController.create)
  );

decksRouter.use("/:deck_id", deckRouter);

export default decksRouter;
