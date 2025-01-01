import { pool } from "../database/pg.client";
import { TableNames } from "../helpers/TableNames";
import { CoreDatamapper } from "./CoreDatamapper";
import { DeckDatamapperReq } from "./interfaces/DeckDatamapperReq";

export class DeckDatamapper extends CoreDatamapper<DeckDatamapperReq> {
  readonly tableName = TableNames.Deck;
  pool = pool;

  findAllDecksByUserId = async (id: number) => {
    const result = await this.pool.query(
      `SELECT * FROM "${this.tableName}" WHERE "user_id" = $1`,
      [id]
    );

    return result.rows;
  };
}
