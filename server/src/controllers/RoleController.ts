import { RoleData } from "../datamappers/interfaces/RoleDatamapperReq";
import { CoreController } from "./CoreController";
import { RoleControllerReq } from "./interfaces/RoleControllerReq";

export class RoleController extends CoreController<
  RoleControllerReq,
  RoleData
> {
  constructor(datamapper: RoleControllerReq["datamapper"]) {
    const field = "name";
    super(datamapper, field);

    this.datamapper = datamapper;
  }

  update = async (req: Request, res: Response): Promise<void> => {};
}
