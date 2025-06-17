import {
  DeckData,
  DeckDatamapperReq
} from "../../datamappers/interfaces/DeckDatamapperReq";
import { EntityControllerReq } from "./EntityControllerReq";

export interface DeckControllerReq extends EntityControllerReq<DeckData> {
  datamapper: Omit<DeckDatamapperReq, "data">;
  getAllDecksByUserEmail(): Promise<DeckData[]>;
}
