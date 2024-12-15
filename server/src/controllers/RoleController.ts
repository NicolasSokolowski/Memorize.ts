import { RoleDatamapperReq } from "../datamappers/interfaces/RoleDatamapperReq";
import { CoreController } from "./CoreController";
import { RoleControllerReq } from "./interfaces/RoleControllerReq";

export class RoleController extends CoreController<
  RoleControllerReq,
  RoleDatamapperReq
> {
  constructor(datamapper: RoleControllerReq["datamapper"]) {
    const field = "name";
    super(datamapper, field);

    this.datamapper = datamapper;
  }
}
