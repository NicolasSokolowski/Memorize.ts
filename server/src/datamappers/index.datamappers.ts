import { UserDatamapper } from "./UserDatamapper";
import { RoleDatamapper } from "./RoleDatamapper";
import { DeckDatamapper } from "./DeckDatamapper";

const userDatamapper = new UserDatamapper();
const roleDatamapper = new RoleDatamapper();
const deckDatamapper = new DeckDatamapper();

export { userDatamapper, roleDatamapper, deckDatamapper };
