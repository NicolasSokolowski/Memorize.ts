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
      `SELECT * FROM "${this.tableName}" 
      WHERE front = $1 
        AND deck_id = $2`,
      [frontName, deckId]
    );
    return result.rows[0];
  };

  update = async (data: CardData): Promise<CardData> => {
    const { front, back, id } = data;
    const result = await this.pool.query(
      `UPDATE "${this.tableName}" 
        SET front = $1, back = $2 
      WHERE id = $3 
      RETURNING *`,
      [front, back, id]
    );
    return result.rows[0];
  };

  findAllCardsByDeckId = async (deckId: number): Promise<CardData[]> => {
    const result = await this.pool.query(
      `SELECT * FROM "${this.tableName}" 
      WHERE deck_id = $1 
      ORDER BY difficulty DESC`,
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

  updateCardsDifficulty = async (cards: CardData[]): Promise<CardData[]> => {
    if (cards.length === 0) return [];

    const placeholders = cards
      .map(
        (_, index) =>
          `($${index * 5 + 1}::INT, $${index * 5 + 2}::INT, $${index * 5 + 3}::INT, $${index * 5 + 4}::INT, $${index * 5 + 5}::INT)`
      )
      .join(", ");

    const values = cards.flatMap((card) => [
      Number(card.id),
      Number(card.difficulty),
      Number(card.win_streak),
      Number(card.next_occurrence),
      Number(card.max_early)
    ]);

    const query = `
    UPDATE "${this.tableName}" AS c
      SET
        difficulty = v.difficulty,
        win_streak = v.win_streak,
        next_occurrence = v.next_occurrence,
        max_early = v.max_early
    FROM (VALUES ${placeholders}) 
      AS v(id, difficulty, win_streak, next_occurrence, max_early)
    WHERE c.id = v.id
    RETURNING c.*;
  `;

    const result = await this.pool.query(query, values);

    return result.rows;
  };

  updateCardsOccurrence = async (cards: CardData[]): Promise<CardData[]> => {
    if (cards.length === 0) return [];

    const placeholders = cards
      .map(
        (_, index) =>
          `($${index * 3 + 1}::INT, $${index * 3 + 2}::INT, $${index * 3 + 3}::INT)`
      )
      .join(", ");

    const values = cards.flatMap((card) => [
      Number(card.id),
      Number(card.next_occurrence),
      Number(card.max_early)
    ]);

    const query = `
    UPDATE "${this.tableName}" AS c
      SET next_occurrence = v.next_occurrence, max_early = v.max_early
    FROM (VALUES ${placeholders}) AS v(id, next_occurrence, max_early)
    WHERE c.id = v.id
    RETURNING c.*;
  `;
    const result = await this.pool.query(query, values);

    return result.rows;
  };

  getUserCardsIfOwned = async (
    cardIds: number[],
    userId: number
  ): Promise<CardData[]> => {
    if (cardIds.length === 0) return [];

    const result = await this.pool.query(
      `
      SELECT card.*
      FROM "card"
      JOIN deck 
        ON card.deck_id = deck.id
      WHERE card.id = ANY($1)
        AND deck.user_id = $2
      `,
      [cardIds, userId]
    );

    if (result.rows.length !== cardIds.length) {
      return null;
    }

    return result.rows;
  };
}
