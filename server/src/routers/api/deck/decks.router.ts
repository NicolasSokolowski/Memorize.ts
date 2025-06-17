import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import {
  requireAuth,
  checkPermissions,
  validateRequest
} from "../../../middlewares/index.middlewares";
import { deckController } from "../../../controllers/index.controllers";
import deckRouter from "./deck.router";
import { deckCreateSchema } from "../../../validation/index.validation";

const decksRouter = express.Router({ mergeParams: true });

decksRouter
  .route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"])),
    errorCatcher(deckController.getAllDecksByUserEmail)
  )
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"])),
    errorCatcher(validateRequest("body", deckCreateSchema)),
    errorCatcher(deckController.create)
  );

decksRouter.use("/:deck_id", deckRouter);

export default decksRouter;
