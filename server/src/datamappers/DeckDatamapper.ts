import { pool } from "../database/pg.client";
import { TableNames } from "../helpers/TableNames";
import { CoreDatamapper } from "./CoreDatamapper";
import { DeckDatamapperReq } from "./interfaces/DeckDatamapperReq";

export class DeckDatamapper extends CoreDatamapper<DeckDatamapperReq> {
  readonly tableName = TableNames.Deck;
  pool = pool;

  findAllDecksByUserEmail = async (email: string) => {
    const result = await this.pool.query(
      `SELECT deck.* FROM "${this.tableName}" 
      LEFT JOIN "user"
      ON deck.user_id = "user".id
      WHERE "user".email = $1
      ORDER BY deck.created_at DESC
      `,
      [email]
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
