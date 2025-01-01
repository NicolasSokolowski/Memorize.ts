import { Request, Response } from "express";
import { DeckDatamapperReq } from "../datamappers/interfaces/DeckDatamapperReq";
import { CoreController } from "./CoreController";
import { DeckControllerReq } from "./interfaces/DeckControllerReq";
import { NotFoundError } from "../errors/NotFoundError.error";

export class DeckController extends CoreController<
  DeckControllerReq,
  DeckDatamapperReq
> {
  constructor(datamapper: DeckControllerReq["datamapper"]) {
    const field = "name";
    super(datamapper, field);

    this.datamapper = datamapper;
  }

  getAllDecksByUserId = async (req: Request, res: Response) => {
    const user_id = parseInt(req.params.user_id, 10);

    const decks = await this.datamapper.findAllDecksByUserId(user_id);

    if (!decks) {
      throw new NotFoundError();
    }

    res.status(200).send(decks);
  };
}
