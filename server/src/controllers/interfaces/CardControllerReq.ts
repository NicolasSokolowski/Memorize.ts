import { CardDatamapperReq } from "../../datamappers/interfaces/CardDatamapperReq";
import { EntityControllerReq } from "./EntityControllerReq";

type CardControllerReqWithoutData = Omit<CardDatamapperReq, "data">;

export interface CardControllerReq extends EntityControllerReq {
  datamapper: CardControllerReqWithoutData;
}
