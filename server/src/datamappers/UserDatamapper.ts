import { pool } from "../database/pg.client";
import { TableNames } from "../helpers/TableNames";
import { CoreDatamapper } from "./CoreDatamapper";
import { UserDatamapperReq } from "./interfaces/UserDatamapperReq";

export class UserDatamapper extends CoreDatamapper<UserDatamapperReq> {
  readonly tableName = TableNames.User;
  pool = pool;
}
