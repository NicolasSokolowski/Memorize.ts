import {
  UserData,
  UserDatamapperReq
} from "../../datamappers/interfaces/UserDatamapperReq";
import { EntityControllerReq } from "./EntityControllerReq";

export interface UserControllerReq extends EntityControllerReq<UserData> {
  datamapper: UserDatamapperReq;
}
