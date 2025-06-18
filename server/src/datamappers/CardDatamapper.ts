import { pool } from "../database/pg.client";
import { TableNames } from "../helpers/TableNames";
import { CoreDatamapper } from "./CoreDatamapper";
import { CardData, CardDatamapperReq } from "./interfaces/CardDatamapperReq";

export class CardDatamapper
  extends CoreDatamapper<CardDatamapperReq>
  implements CardDatamapperReq
{
  readonly tableName = TableNames.Card;
  pool = pool;

  findCardUserByCardId = async (cardId: number) => {
    const result = await this.pool.query(
      `SELECT "user".email FROM "user"
      INNER JOIN "deck"
        ON deck.user_id = "user".id
      INNER JOIN "card"
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

  update = async (data: CardData): Promise<CardData> => {
    const { front, back, id } = data;
    const result = await this.pool.query(
      `UPDATE "${this.tableName}" SET front = $1, back = $2 WHERE id = $3 RETURNING *`,
      [front, back, id]
    );
    return result.rows[0];
  };

  findAllCardsByDeckId = async (deckId: number): Promise<CardData[]> => {
    const result = await this.pool.query(
      `SELECT * FROM "${this.tableName}" WHERE deck_id = $1 ORDER BY difficulty DESC`,
      [deckId]
    );
    return result.rows;
  };

  findAllCardsByUserEmail = async (email: string): Promise<CardData[]> => {
    const result = await this.pool.query(
      `SELECT card.* FROM "${this.tableName}"
      JOIN deck 
      ON card.deck_id = deck.id
      JOIN "user" 
      ON deck.user_id = "user".id
      WHERE "user".email = $1`,
      [email]
    );
    return result.rows;
  };

  updateCardsDifficultyAtLogin = async (
    cards: CardData[]
  ): Promise<CardData[]> => {
    if (cards.length === 0) return [];

    const valuesPlaceholders = cards
      .map((_, index) => `($${index * 2 + 1}::INT, $${index * 2 + 2}::INT)`)
      .join(", ");

    const values = cards.flatMap((card) => [
      Number(card.id),
      Number(card.difficulty)
    ]);

    const query = `
    UPDATE "${this.tableName}" AS c
    SET difficulty = v.difficulty
    FROM (VALUES ${valuesPlaceholders}) AS v(id, difficulty)
    WHERE c.id = v.id
    RETURNING c.*;
  `;
    const result = await this.pool.query(query, values);

    return result.rows;
  };
}
