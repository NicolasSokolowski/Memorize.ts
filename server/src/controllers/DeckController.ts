import { Request, Response } from "express";
import { DeckDatamapperReq } from "../datamappers/interfaces/DeckDatamapperReq";
import { CoreController } from "./CoreController";
import { DeckControllerReq } from "./interfaces/DeckControllerReq";
import { NotFoundError } from "../errors/NotFoundError.error";
import { DatabaseConnectionError } from "../errors/DatabaseConnectionError.error";
import { userDatamapper } from "../datamappers/index.datamappers";
import { BadRequestError } from "../errors/BadRequestError.error";

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

  create = async (req: Request, res: Response): Promise<void> => {
    const data = req.body;
    const userEmail = req.user?.email;

    const user = await userDatamapper.findBySpecificField("email", userEmail);

    if (!user) {
      throw new NotFoundError();
    }

    data.user_id = user.id;

    const checkIfExists = await this.datamapper.findBySpecificField(
      this.field,
      data[this.field]
    );

    if (checkIfExists) {
      throw new BadRequestError(`Provided item already exists.`);
    }

    const createdItem = await this.datamapper.insert(data);

    if (!createdItem) {
      throw new DatabaseConnectionError();
    }

    res.status(201).json(createdItem);
  };

  update = async (req: Request, res: Response): Promise<void> => {};
}
