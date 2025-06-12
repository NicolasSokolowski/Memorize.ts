import { TableNames } from "../../helpers/TableNames";
import { EntityDatamapperReq } from "./EntityDatamapperReq";

export interface DeckDatamapperReq extends EntityDatamapperReq {
  tableName: TableNames.Deck;
  data: {
    id?: number;
    name: string;
    user_id?: number;
    created_at?: Date;
    updated_at?: Date;
  };
  findAllDecksByUserId(id: number): Promise<DeckDatamapperReq["data"][]>;
  update(data: DeckDatamapperReq["data"]): Promise<DeckDatamapperReq["data"]>;
}
