import {
  roleDatamapper,
  userDatamapper,
  deckDatamapper,
} from "../datamappers/index.datamappers";
import { RoleController } from "./RoleController";
import { UserController } from "./UserController";
import { DeckController } from "./DeckController";

const userController = new UserController(userDatamapper);
const roleController = new RoleController(roleDatamapper);
const deckController = new DeckController(deckDatamapper);

export { userController, roleController, deckController };
