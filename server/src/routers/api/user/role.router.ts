import express from "express";
import { errorCatcher } from "../../../helpers/errorCatcher.helper";
import { roleController } from "../../../controllers/index.controllers";

const roleRouter = express.Router();

roleRouter
  .route("/")
  .get(errorCatcher(roleController.getAll))
  .post(errorCatcher(roleController.create));

export default roleRouter;
