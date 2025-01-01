import { TableNames } from "../../helpers/TableNames";
import { EntityDatamapperReq } from "./EntityDatamapperReq";

export interface DeckDatamapperReq extends EntityDatamapperReq {
  tableName: TableNames.Deck;
  data: {
    id?: number;
    name: string;
  };
  findAllDecksByUserId(id: number): Promise<DeckDatamapperReq["data"][]>;
}
