import { TableNames } from "../../helpers/TableNames";
import { EntityDatamapperReq } from "./EntityDatamapperReq";

export type CardData = {
  id?: number;
  front: string;
  back: string;
  difficulty?: number;
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
}
