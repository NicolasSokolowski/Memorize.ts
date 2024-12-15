import {
  roleDatamapper,
  userDatamapper,
} from "../datamappers/index.datamappers";
import { RoleController } from "./RoleController";
import { UserController } from "./UserController";

const userController = new UserController(userDatamapper);
const roleController = new RoleController(roleDatamapper);

export { userController, roleController };
