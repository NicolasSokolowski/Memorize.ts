import { pool } from "../database/pg.client";
import { TableNames } from "../helpers/TableNames";
import { CoreDatamapper } from "./CoreDatamapper";
import { CardDatamapperReq } from "./interfaces/CardDatamapperReq";

export class CardDatamapper extends CoreDatamapper<CardDatamapperReq> {
  readonly tableName = TableNames.Card;
  pool = pool;

  findCardUserByCardId = async (cardId: number) => {
    const result = await this.pool.query(
      `SELECT "user".email FROM "${this.tableName}" FROM "user"
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
    data: CardDatamapperReq["data"],
    emailCookie: string
  ): Promise<CardDatamapperReq["data"]> => {
    const { front } = data;
    const result = await this.pool.query(
      `UPDATE "${this.tableName}" SET front = $1 WHERE email = $2 RETURNING *`,
      [front, emailCookie]
    );
    return result.rows[0];
  };
}
