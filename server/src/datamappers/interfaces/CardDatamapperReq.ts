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
  };
  checkCompositeKey(
    frontName: string,
    deckId: number
  ): Promise<CardDatamapperReq["data"] | null>;
}
