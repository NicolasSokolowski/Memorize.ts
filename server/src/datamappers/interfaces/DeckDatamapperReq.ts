import { TableNames } from "../../helpers/TableNames";
import { CardData } from "./CardDatamapperReq";
import { EntityDatamapperReq } from "./EntityDatamapperReq";

export type DeckData = {
  id?: number;
  name: string;
  user_id?: number;
  created_at?: Date;
  updated_at?: Date;
};

export interface DeckDatamapperReq extends EntityDatamapperReq {
  tableName: TableNames.Deck;
  findAllDecksByUserEmail(email: string): Promise<DeckData[]>;
  findAllCardsByDeckId(deckId: number): Promise<CardData[]>;
  update(data: DeckData): Promise<DeckData>;
}
