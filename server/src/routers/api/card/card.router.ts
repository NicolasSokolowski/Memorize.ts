import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth } from "../../../middlewares/requireAuth.helper";
import { checkPermissions } from "../../../middlewares/checkPermissions.middleware";
import { cardController } from "../../../controllers/index.controllers";

const cardRouter = express.Router({ mergeParams: true });

cardRouter
  .route("/")
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "card")),
    errorCatcher(cardController.update)
  );

export default cardRouter;
