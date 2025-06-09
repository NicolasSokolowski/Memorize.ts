import { TableNames } from "../../helpers/TableNames";
import { EntityDatamapperReq } from "./EntityDatamapperReq";

export interface UserDatamapperReq extends EntityDatamapperReq {
  tableName: TableNames.User;
  data: {
    email: string;
    password: string;
    username: string;
    role_id?: number;
  };
}
