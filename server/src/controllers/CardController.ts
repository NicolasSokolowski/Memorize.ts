import { Request, Response } from "express";
import { CardDatamapperReq } from "../datamappers/interfaces/CardDatamapperReq";
import { CoreController } from "./CoreController";
import { CardControllerReq } from "./interfaces/CardControllerReq";
import {
  BadRequestError,
  DatabaseConnectionError
} from "../errors/index.errors";

export class CardController extends CoreController<
  CardControllerReq,
  CardDatamapperReq
> {
  constructor(datamapper: CardControllerReq["datamapper"]) {
    const field = "front";
    super(datamapper, field);

    this.datamapper = datamapper;
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const data = req.body;
    const deckId = parseInt(req.params.deck_id, 10);

    const checkIfExists = await this.datamapper.checkCompositeKey(
      data.front,
      deckId
    );

    data.deck_id = deckId;

    if (checkIfExists) {
      throw new BadRequestError(`Front side already exists in this deck.`);
    }

    const createdItem = await this.datamapper.insert(data);

    if (!createdItem) {
      throw new DatabaseConnectionError();
    }

    res.status(201).json(createdItem);
  };

  update = async (req: Request, res: Response): Promise<void> => {};
}
