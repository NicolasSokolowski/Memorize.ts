import { Request, Response } from "express";
import { CardData } from "../datamappers/interfaces/CardDatamapperReq";
import { CoreController } from "./CoreController";
import { CardControllerReq } from "./interfaces/CardControllerReq";
import {
  BadRequestError,
  DatabaseConnectionError,
  NotFoundError
} from "../errors/index.errors";

export class CardController extends CoreController<
  CardControllerReq,
  CardData
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

  update = async (req: Request, res: Response): Promise<void> => {
    const cardId = parseInt(req.params.card_id, 10);
    const data: Partial<CardData> = req.body;

    const card = await this.datamapper.findByPk(cardId);

    if (!card) {
      throw new NotFoundError();
    }

    const checkIfCardExistsInDeck = await this.datamapper.checkCompositeKey(
      data.front,
      card.deck_id
    );

    if (checkIfCardExistsInDeck && checkIfCardExistsInDeck.id !== cardId) {
      throw new BadRequestError(
        `Front side already exists in this deck with ID ${card.deck_id}.`
      );
    }

    const mergedData: CardData = {
      ...card,
      ...data,
      id: cardId
    };

    const updatedItem = await this.datamapper.update(mergedData);

    if (!updatedItem) {
      throw new DatabaseConnectionError();
    }

    const { created_at, updated_at, ...cardWithoutTimestamps } = updatedItem;

    res.status(200).json(cardWithoutTimestamps);
  };
}
