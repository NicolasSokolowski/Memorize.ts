import { pool } from "../database/pg.client";
import { TableNames } from "../helpers/TableNames";
import { CoreDatamapper } from "./CoreDatamapper";
import { CardDatamapperReq } from "./interfaces/CardDatamapperReq";

export class CardDatamapper extends CoreDatamapper<CardDatamapperReq> {
  readonly tableName = TableNames.Card;
  pool = pool;

  findCardUserByCardId = async (cardId: number) => {
    const result = await this.pool.query(
      `SELECT "user".email FROM "user"
      LEFT JOIN "deck"
        ON deck.user_id = "user".id
      LEFT JOIN "card"
        ON card.deck_id = deck.id
      WHERE card.id = $1`,
      [cardId]
    );
    return result.rows[0];
  };

  checkCompositeKey = async (frontName: string, deckId: number) => {
    const result = await this.pool.query(
      `SELECT * FROM "${this.tableName}" WHERE front = $1 AND deck_id = $2`,
      [frontName, deckId]
    );
    return result.rows[0];
  };

  update = async (
    data: CardDatamapperReq["data"]
  ): Promise<CardDatamapperReq["data"]> => {
    const { front, back, id } = data;
    const result = await this.pool.query(
      `UPDATE "${this.tableName}" SET front = $1, back = $2 WHERE id = $3 RETURNING *`,
      [front, back, id]
    );
    return result.rows[0];
  };
}
