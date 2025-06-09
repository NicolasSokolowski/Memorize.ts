import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { roleController } from "../../../controllers/index.controllers";
import {
  validateRequest,
  requireAuth,
  checkPermissions
} from "../../../middlewares/index.middlewares";
import { roleCreateSchema } from "../../../validation/index.validation";

const roleRouter = express.Router();

roleRouter
  .route("/")
  .get(errorCatcher(roleController.getAll))
  .post(
    errorCatcher(requireAuth),
    errorCatcher(checkPermissions(["admin"])),
    errorCatcher(validateRequest("body", roleCreateSchema)),
    errorCatcher(roleController.create)
  );

export default roleRouter;
