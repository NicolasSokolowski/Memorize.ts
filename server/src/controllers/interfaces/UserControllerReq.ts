import { UserDatamapperReq } from "../../datamappers/interfaces/UserDatamapperReq";
import { EntityControllerReq } from "./EntityControllerReq";

export type UserDatamapperReqWithoutData = Omit<UserDatamapperReq, "data">;

export interface UserControllerReq extends EntityControllerReq {
  datamapper: UserDatamapperReqWithoutData;
}
