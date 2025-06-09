import { Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError.error";
import { NotFoundError } from "../errors/NotFoundError.error";
import { DatabaseConnectionError } from "../errors/DatabaseConnectionError.error";
import { EntityDatamapperReq } from "../datamappers/interfaces/EntityDatamapperReq";
import { EntityControllerReq } from "./interfaces/EntityControllerReq";

export abstract class CoreController<
  T extends EntityControllerReq,
  Y extends EntityDatamapperReq
> {
  protected field: string;

  get tableName(): string {
    return this.datamapper.tableName;
  }

  constructor(
    public datamapper: T["datamapper"],
    field: string
  ) {
    this.field = field;
  }

  getByPk = async (req: Request, res: Response): Promise<void> => {
    const paramName = `${this.tableName}_id`;
    const id: number = parseInt(req.params[paramName]);

    if (!id) {
      throw new BadRequestError("You should provide an id");
    }

    const searchedItem = await this.datamapper.findByPk(id);

    if (!searchedItem) {
      throw new NotFoundError();
    }

    res.status(200).send(searchedItem);
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    const itemsList = await this.datamapper.findAll();

    if (!itemsList) {
      throw new NotFoundError();
    }

    res.status(200).send(itemsList);
  };

  getBySpecificField = async (field: string, value: string) => {
    const item = await this.datamapper.findBySpecificField(field, value);
    return item;
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const data: Y["data"] = req.body;

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

  preDeletionCheck = async (
    field: string,
    value: string | number
  ): Promise<void> => {
    return;
  };

  delete = async (req: Request, res: Response) => {
    const paramName = `${this.tableName}_id`;
    const id: number = parseInt(req.params[paramName]);

    if (!id) {
      throw new BadRequestError("This id doesn't exist");
    }

    const itemToDelete = await this.datamapper.findByPk(id);

    if (!itemToDelete) {
      throw new NotFoundError();
    }

    await this.preDeletionCheck(this.field, itemToDelete);

    const deletedItem = await this.datamapper.delete(id);

    if (!deletedItem) {
      throw new DatabaseConnectionError();
    }

    res
      .status(200)
      .send({ success: true, message: "Item successfully deleted." });
  };
}
