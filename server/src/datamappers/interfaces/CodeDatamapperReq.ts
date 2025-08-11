import { TableNames } from "../../helpers/TableNames";
import { EntityDatamapperReq } from "./EntityDatamapperReq";

export type CodeData = {
  id?: number;
  code: string;
  request_type: string;
  user_id: number;
  expiration: Date;
  created_at?: Date;
  updated_at?: Date;
};

export interface CodeDatamapperReq extends EntityDatamapperReq {
  tableName: TableNames.Code;
  checkCompositeKey(
    requestType: string,
    userId: number
  ): Promise<CodeData | null>;
}
