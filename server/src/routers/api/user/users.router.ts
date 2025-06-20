import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import {
  cardController,
  userController
} from "../../../controllers/index.controllers";
import rolesRouter from "../role/roles.router";
import {
  requireAuth,
  validateRequest,
  checkPermissions
} from "../../../middlewares/index.middlewares";
import {
  cardsArraySchema,
  userCreateSchema
} from "../../../validation/index.validation";
import userRouter from "./user.router";

const usersRouter = express.Router();

usersRouter
  .route("/")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(userController.getAll)
  )
  .post(
    errorCatcher(validateRequest("body", userCreateSchema)),
    errorCatcher(userController.signup)
  );

usersRouter
  .route("/me/cards")
  .get(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"])),
    errorCatcher(cardController.getAllCardsByUserEmail)
  )
  .patch(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin", "user"])),
    errorCatcher(validateRequest("body", cardsArraySchema)),
    errorCatcher(cardController.updateCardsDifficulty)
  );

usersRouter.use("/:user_id", userRouter);
usersRouter.use("/roles", rolesRouter);

export default usersRouter;
