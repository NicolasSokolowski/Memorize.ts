import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { requireAuth } from "../../../middlewares/requireAuth.helper";
import { checkPermissions } from "../../../middlewares/checkPermissions.middleware";
import { cardController } from "../../../controllers/index.controllers";

const cardRouter = express.Router({ mergeParams: true });

cardRouter
  .route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "card")),
    errorCatcher(cardController.getByPk)
  )
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "card")),
    errorCatcher(cardController.update)
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "card")),
    errorCatcher(cardController.delete)
  );

export default cardRouter;
