import { UserDatamapper } from "./UserDatamapper";
import { RoleDatamapper } from "./RoleDatamapper";
import { DeckDatamapper } from "./DeckDatamapper";
import { CardDatamapper } from "./CardDatamapper";

const userDatamapper = new UserDatamapper();
const roleDatamapper = new RoleDatamapper();
const deckDatamapper = new DeckDatamapper();
const cardDatamapper = new CardDatamapper();

export { userDatamapper, roleDatamapper, deckDatamapper, cardDatamapper };
