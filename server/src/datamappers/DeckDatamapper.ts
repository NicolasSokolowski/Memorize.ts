import { pool } from "../database/pg.client";
import { TableNames } from "../helpers/TableNames";
import { CoreDatamapper } from "./CoreDatamapper";
import { DeckDatamapperReq } from "./interfaces/DeckDatamapperReq";

export class DeckDatamapper extends CoreDatamapper<DeckDatamapperReq> {
  readonly tableName = TableNames.Deck;
  pool = pool;
}
