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

  update = async (
    data: DeckDatamapperReq["data"]
  ): Promise<DeckDatamapperReq["data"]> => {
    const { name, id } = data;
    const result = await this.pool.query(
      `UPDATE "${this.tableName}" SET name = $1 WHERE id = $2 RETURNING *`,
      [name, id]
    );
    return result.rows[0];
  };
}
