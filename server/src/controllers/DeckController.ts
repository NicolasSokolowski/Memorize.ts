import { Request, Response } from "express";
import { DeckData } from "../datamappers/interfaces/DeckDatamapperReq";
import { CoreController } from "./CoreController";
import { DeckControllerReq } from "./interfaces/DeckControllerReq";
import { NotFoundError } from "../errors/NotFoundError.error";
import { DatabaseConnectionError } from "../errors/DatabaseConnectionError.error";
import { userDatamapper } from "../datamappers/index.datamappers";
import { BadRequestError } from "../errors/BadRequestError.error";

export class DeckController extends CoreController<
  DeckControllerReq,
  DeckData
> {
  constructor(datamapper: DeckControllerReq["datamapper"]) {
    const field = "name";
    super(datamapper, field);

    this.datamapper = datamapper;
  }

  getAllDecksByUserEmail = async (req: Request, res: Response) => {
    const userEmail = req.user?.email;

    const decks = await this.datamapper.findAllDecksByUserEmail(userEmail);

    if (!decks) {
      throw new NotFoundError();
    }

    res.status(200).send(decks);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const data = req.body;
    const userEmail = req.user?.email;

    const user = await userDatamapper.findBySpecificField("email", userEmail);

    if (!user) {
      throw new NotFoundError();
    }

    data.user_id = user.id;

    const createdItem = await this.datamapper.insert(data);

    if (!createdItem) {
      throw new DatabaseConnectionError();
    }

    res.status(201).json(createdItem);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const deck_id: number = parseInt(req.params.deck_id, 10);
    const data: DeckData = req.body;

    if (!deck_id) {
      throw new BadRequestError("You should provide a valid id");
    }

    const deck = await this.datamapper.findByPk(deck_id);

    if (!deck) {
      throw new NotFoundError();
    }

    const checkIfExists = await this.datamapper.findBySpecificField(
      this.field,
      data[this.field]
    );

    if (checkIfExists) {
      throw new BadRequestError("Name already exists in this deck.", "name");
    }

    data.id = deck_id;

    const updatedDeck = await this.datamapper.update(data);

    if (!updatedDeck) {
      throw new DatabaseConnectionError();
    }

    const { user_id, created_at, updated_at, ...deckWithoutSensitiveData } =
      updatedDeck;

    res.status(200).send(deckWithoutSensitiveData);
  };
}
