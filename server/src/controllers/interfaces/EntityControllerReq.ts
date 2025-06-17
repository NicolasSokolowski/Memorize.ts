import { EntityDatamapperReq } from "../../datamappers/interfaces/EntityDatamapperReq";

export interface EntityControllerReq<D> {
  datamapper: EntityDatamapperReq<D>;
  getByPk(): Promise<void>;
  getAll(): Promise<void>;
  getBySpecificField(): Promise<D>;
  create(): Promise<void>;
  delete(): Promise<void>;
}
