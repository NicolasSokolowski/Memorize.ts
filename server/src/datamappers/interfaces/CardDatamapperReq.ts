import { TableNames } from "../../helpers/TableNames";
import { EntityDatamapperReq } from "./EntityDatamapperReq";

export interface CardDatamapperReq extends EntityDatamapperReq {
  tableName: TableNames.Card;
  data: {
    id?: number;
    front: string;
    back: string;
    difficulty?: number;
    deck_id: number;
    created_at?: Date;
    updated_at?: Date;
  };
  checkCompositeKey(
    frontName: string,
    deckId: number
  ): Promise<CardDatamapperReq["data"] | null>;
  update(data: CardDatamapperReq["data"]): Promise<CardDatamapperReq["data"]>;
}
