import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth } from "../../../middlewares/requireAuth.helper";
import { deckController } from "../../../controllers/index.controllers";
import { checkPermissions } from "../../../middlewares/checkPermissions.middleware";

const deckRouter = express.Router();

deckRouter
  .route("/")
  .post(
    errorCatcher(checkPermissions(["admin", "user"], "user")),
    errorCatcher(deckController.create)
  );

deckRouter
  .route("/:deck_id")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "deck")),
    errorCatcher(deckController.getByPk)
  )
  .put(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "deck")),
    errorCatcher(deckController.update)
  );

export default deckRouter;
