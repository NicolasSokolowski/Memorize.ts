import { CardDatamapperReq } from "../datamappers/interfaces/CardDatamapperReq";
import { CoreController } from "./CoreController";
import { CardControllerReq } from "./interfaces/CardControllerReq";

export class CardController extends CoreController<
  CardControllerReq,
  CardDatamapperReq
> {
  constructor(datamapper: CardControllerReq["datamapper"]) {
    const field = "front";
    super(datamapper, field);

    this.datamapper = datamapper;
  }
}
