import {
  roleDatamapper,
  userDatamapper,
  deckDatamapper,
  cardDatamapper
} from "../datamappers/index.datamappers";
import { RoleController } from "./RoleController";
import { UserController } from "./UserController";
import { DeckController } from "./DeckController";
import { CardController } from "./CardController";

const userController = new UserController(userDatamapper);
const roleController = new RoleController(roleDatamapper);
const deckController = new DeckController(deckDatamapper);
const cardController = new CardController(cardDatamapper);

export { userController, roleController, deckController, cardController };
