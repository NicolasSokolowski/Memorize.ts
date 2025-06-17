import { pool } from "../database/pg.client";
import { TableNames } from "../helpers/TableNames";
import { CoreDatamapper } from "./CoreDatamapper";
import { DeckData } from "./interfaces/DeckDatamapperReq";

export class DeckDatamapper extends CoreDatamapper<DeckData> {
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

  findAllCardsByDeckId = async (deckId: number) => {
    const result = await this.pool.query(
      `SELECT card.* FROM "card"
      LEFT JOIN "deck"
      ON card.deck_id = deck.id
      WHERE deck.id = $1
      `,
      [deckId]
    );

    return result.rows;
  };

  update = async (data: DeckData): Promise<DeckData> => {
    const { name, id } = data;
    const result = await this.pool.query(
      `UPDATE "${this.tableName}" SET name = $1 WHERE id = $2 RETURNING *`,
      [name, id]
    );
    return result.rows[0];
  };
}
