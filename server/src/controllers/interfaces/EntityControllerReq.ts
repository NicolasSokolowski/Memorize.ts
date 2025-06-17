import { EntityDatamapperReq } from "../../datamappers/interfaces/EntityDatamapperReq";

export interface EntityControllerReq<D> {
  datamapper: EntityDatamapperReq<D>;
}
