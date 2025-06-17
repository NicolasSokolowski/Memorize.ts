import { pool } from "../database/pg.client";
import { TableNames } from "../helpers/TableNames";
import { CoreDatamapper } from "./CoreDatamapper";
import { UserData } from "./interfaces/UserDatamapperReq";

export class UserDatamapper extends CoreDatamapper<UserData> {
  readonly tableName = TableNames.User;
  pool = pool;

  update = async (data: UserData, emailCookie: string): Promise<UserData> => {
    const { email, password, username } = data;
    const result = await this.pool.query(
      `UPDATE "${this.tableName}" SET email = $1, password = $2, username = $3 WHERE email = $4 RETURNING *`,
      [email, password, username, emailCookie]
    );
    return result.rows[0];
  };

  updatePassword = async (
    newPassword: string,
    emailCookie: string
  ): Promise<UserData> => {
    const result = await this.pool.query(
      `UPDATE "${this.tableName}" SET password = $1 WHERE email = $2 RETURNING *`,
      [newPassword, emailCookie]
    );
    return result.rows[0];
  };

  updateRole = async (userId: number, roleId: number): Promise<UserData> => {
    const result = await this.pool.query(
      `UPDATE "${this.tableName}" SET role_id = $1 WHERE id = $2 RETURNING *`,
      [roleId, userId]
    );
    return result.rows[0];
  };
}
