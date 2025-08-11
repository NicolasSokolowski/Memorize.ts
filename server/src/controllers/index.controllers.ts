import {
  roleDatamapper,
  userDatamapper,
  deckDatamapper,
  cardDatamapper,
  codeDatamapper
} from "../datamappers/index.datamappers";
import { RoleController } from "./RoleController";
import { UserController } from "./UserController";
import { DeckController } from "./DeckController";
import { CardController } from "./CardController";
import { CodeController } from "./CodeController";

const userController = new UserController(userDatamapper);
const roleController = new RoleController(roleDatamapper);
const deckController = new DeckController(deckDatamapper);
const cardController = new CardController(cardDatamapper);
const codeController = new CodeController(codeDatamapper);

export {
  userController,
  roleController,
  deckController,
  cardController,
  codeController
};
