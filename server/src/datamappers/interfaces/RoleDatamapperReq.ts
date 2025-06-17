import { TableNames } from "../../helpers/TableNames";
import { EntityDatamapperReq } from "./EntityDatamapperReq";

export type RoleData = {
  id?: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
};

export interface RoleDatamapperReq extends EntityDatamapperReq {
  tableName: TableNames.Role;
  update(data: RoleData, emailCookie: string): Promise<RoleData>;
}
