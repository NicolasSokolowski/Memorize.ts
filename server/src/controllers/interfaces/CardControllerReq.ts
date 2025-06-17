import {
  CardData,
  CardDatamapperReq
} from "../../datamappers/interfaces/CardDatamapperReq";
import { EntityControllerReq } from "./EntityControllerReq";

export interface CardControllerReq extends EntityControllerReq<CardData> {
  datamapper: CardDatamapperReq;
}
