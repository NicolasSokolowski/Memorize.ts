import { pool } from "../database/pg.client";
import { TableNames } from "../helpers/TableNames";
import { CoreDatamapper } from "./CoreDatamapper";
import { CardDatamapperReq } from "./interfaces/CardDatamapperReq";

export class CardDatamapper extends CoreDatamapper<CardDatamapperReq> {
  readonly tableName = TableNames.Card;
  pool = pool;
}
