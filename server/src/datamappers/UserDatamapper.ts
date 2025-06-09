import { pool } from "../database/pg.client";
import { TableNames } from "../helpers/TableNames";
import { CoreDatamapper } from "./CoreDatamapper";
import { UserDatamapperReq } from "./interfaces/UserDatamapperReq";

export class UserDatamapper extends CoreDatamapper<UserDatamapperReq> {
  readonly tableName = TableNames.User;
  pool = pool;

  update = async (
    data: UserDatamapperReq["data"],
    emailCookie: string
  ): Promise<UserDatamapperReq["data"]> => {
    const { email, password, username } = data;
    const result = await this.pool.query(
      `UPDATE "${this.tableName}" SET email = $1, password = $2, username = $3 WHERE email = $4 RETURNING *`,
      [email, password, username, emailCookie]
    );
    return result.rows[0];
  };
}
