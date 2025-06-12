import express from "express";
import { errorCatcher } from "../../../helpers/index.helpers";
import {
  requireAuth,
  checkPermissions,
  validateRequest
} from "../../../middlewares/index.middlewares";
import { cardController } from "../../../controllers/index.controllers";
import { cardUpdateSchema } from "../../../validation/index.validation";

const cardRouter = express.Router({ mergeParams: true });

cardRouter
  .route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "card")),
    errorCatcher(cardController.getByPk)
  )
  .put(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "card")),
    errorCatcher(validateRequest("body", cardUpdateSchema)),
    errorCatcher(cardController.update)
  )
  .delete(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"], "card")),
    errorCatcher(cardController.delete)
  );

export default cardRouter;
