import { DeckDatamapperReq } from "../../datamappers/interfaces/DeckDatamapperReq";
import { EntityControllerReq } from "./EntityControllerReq";

type DeckControllerReqWithoutData = Omit<DeckDatamapperReq, "data">;

export interface DeckControllerReq extends EntityControllerReq {
  datamapper: DeckControllerReqWithoutData;
  getAllDecksByUserId(): Promise<DeckDatamapperReq["data"][]>;
}
