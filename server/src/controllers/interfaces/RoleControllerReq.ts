import {
  RoleData,
  RoleDatamapperReq
} from "../../datamappers/interfaces/RoleDatamapperReq";
import { EntityControllerReq } from "./EntityControllerReq";

export interface RoleControllerReq extends EntityControllerReq<RoleData> {
  datamapper: RoleDatamapperReq;
}
