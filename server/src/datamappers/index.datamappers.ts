import { UserDatamapper } from "./UserDatamapper";
import { RoleDatamapper } from "./RoleDatamapper";
import { DeckDatamapper } from "./DeckDatamapper";
import { CardDatamapper } from "./CardDatamapper";
import { CodeDatamapper } from "./CodeDatamapper";

const userDatamapper = new UserDatamapper();
const roleDatamapper = new RoleDatamapper();
const deckDatamapper = new DeckDatamapper();
const cardDatamapper = new CardDatamapper();
const codeDatamapper = new CodeDatamapper();

export {
  userDatamapper,
  roleDatamapper,
  deckDatamapper,
  cardDatamapper,
  codeDatamapper
};
