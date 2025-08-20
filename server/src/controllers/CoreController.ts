import { Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError.error";
import { NotFoundError } from "../errors/NotFoundError.error";
import { DatabaseConnectionError } from "../errors/DatabaseConnectionError.error";
import { EntityControllerReq } from "./interfaces/EntityControllerReq";

export abstract class CoreController<T extends EntityControllerReq<D>, D> {
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
      throw new BadRequestError("ID parameter is missing", "INVALID_PARAMETER");
    }

    const searchedItem = await this.datamapper.findByPk(id);

    if (!searchedItem) {
      throw new NotFoundError("Item not found");
    }

    res.status(200).send(searchedItem);
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    const itemsList = await this.datamapper.findAll();

    if (!itemsList) {
      throw new NotFoundError("Items not found");
    }

    res.status(200).send(itemsList);
  };

  getBySpecificField = async (field: string, value: string): Promise<D> => {
    const item = await this.datamapper.findBySpecificField(field, value);

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    return item;
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const data: D = req.body;

    const checkIfExists = await this.datamapper.findBySpecificField(
      this.field,
      data[this.field]
    );

    if (checkIfExists) {
      throw new BadRequestError(
        `Provided item already exists`,
        "DUPLICATE_ENTRY"
      );
    }

    const createdItem = await this.datamapper.insert(data);

    if (!createdItem) {
      throw new DatabaseConnectionError();
    }

    res.status(201).json(createdItem);
  };

  delete = async (req: Request, res: Response) => {
    const paramName = `${this.tableName}_id`;
    const id: number = parseInt(req.params[paramName]);

    if (!id || isNaN(id)) {
      throw new BadRequestError(
        "Please provide a valid id",
        "INVALID_PARAMETER"
      );
    }

    const itemToDelete = await this.datamapper.findByPk(id);

    if (!itemToDelete) {
      throw new NotFoundError("Item not found");
    }

    const deletedItem = await this.datamapper.delete(id);

    if (!deletedItem) {
      throw new DatabaseConnectionError();
    }

    res
      .status(200)
      .send({ success: true, message: "Item successfully deleted." });
  };
}
