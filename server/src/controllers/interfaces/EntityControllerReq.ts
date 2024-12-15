import { EntityDatamapperReq } from "../../datamappers/interfaces/EntityDatamapperReq";

type EntityDatamapperReqWithoutData = Omit<EntityDatamapperReq, "data">;

export interface EntityControllerReq {
  datamapper: EntityDatamapperReqWithoutData;
  getByPk(): Promise<void>;
  getAll(): Promise<void>;
  getBySpecificField(): Promise<EntityDatamapperReq["data"]>;
  create(): Promise<void>;
  delete(): Promise<void>;
}
