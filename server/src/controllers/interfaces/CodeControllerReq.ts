import {
  CodeData,
  CodeDatamapperReq
} from "../../datamappers/interfaces/CodeDatamapperReq";
import { EntityControllerReq } from "./EntityControllerReq";

export interface CodeControllerReq extends EntityControllerReq<CodeData> {
  datamapper: CodeDatamapperReq;
}
