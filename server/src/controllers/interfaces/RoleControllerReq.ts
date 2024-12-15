import { RoleDatamapperReq } from "../../datamappers/interfaces/RoleDatamapperReq";
import { EntityControllerReq } from "./EntityControllerReq";

type RoleDatamapperReqWithoutData = Omit<RoleDatamapperReq, "data">;

export interface RoleControllerReq extends EntityControllerReq {
  datamapper: RoleDatamapperReqWithoutData;
}
