import { TableNames } from "../../helpers/TableNames";
import { EntityDatamapperReq } from "./EntityDatamapperReq";

export type CardData = {
  id?: number;
  front: string;
  back: string;
  difficulty?: number;
  win_streak?: number;
  max_early?: number;
  next_occurrence?: number;
  deck_id: number;
  created_at?: Date;
  updated_at?: Date;
};

export interface CardDatamapperReq extends EntityDatamapperReq {
  tableName: TableNames.Card;
  checkCompositeKey(
    frontName: string,
    deckId: number
  ): Promise<CardData | null>;
  update(data: CardData): Promise<CardData>;
  findAllCardsByDeckId(deckId: number): Promise<CardData[]>;
  findAllCardsByUserEmail(email: string): Promise<CardData[]>;
  updateCardsDifficulty(cards: CardData[]): Promise<CardData[]>;
  updateCardsOccurrence(cards: CardData[]): Promise<CardData[]>;
  getUserCardsIfOwned(cardIds: number[], userId: number): Promise<CardData[]>;
}
