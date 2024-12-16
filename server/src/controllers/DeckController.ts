import { DeckDatamapperReq } from "../datamappers/interfaces/DeckDatamapperReq";
import { CoreController } from "./CoreController";
import { DeckControllerReq } from "./interfaces/DeckControllerReq";

export class DeckController extends CoreController<
  DeckControllerReq,
  DeckDatamapperReq
> {
  constructor(datamapper: DeckControllerReq["datamapper"]) {
    const field = "name";
    super(datamapper, field);

    this.datamapper = datamapper;
  }
}
