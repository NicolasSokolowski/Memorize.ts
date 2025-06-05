import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { roleController } from "../../../controllers/index.controllers";
import { validateRequest } from "../../../middlewares/validateRequest.middleware";
import { roleCreateSchema } from "../../../validation/index.validation";

const roleRouter = express.Router();

roleRouter
  .route("/")
  .get(errorCatcher(roleController.getAll))
  .post(
    errorCatcher(validateRequest("body", roleCreateSchema)),
    errorCatcher(roleController.create)
  );

export default roleRouter;
