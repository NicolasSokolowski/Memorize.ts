import { pool } from "../database/pg.client";
import { TableNames } from "../helpers/TableNames";
import { CoreDatamapper } from "./CoreDatamapper";
import { RoleDatamapperReq } from "./interfaces/RoleDatamapperReq";

export class RoleDatamapper extends CoreDatamapper<RoleDatamapperReq> {
  readonly tableName = TableNames.Role;
  pool = pool;

  update = async (
    data: RoleDatamapperReq["data"],
    emailCookie: string
  ): Promise<RoleDatamapperReq["data"]> => {
    const { name } = data;
    const result = await this.pool.query(
      `UPDATE "${this.tableName}" SET name = $1 WHERE email = $2 RETURNING *`,
      [name, emailCookie]
    );
    return result.rows[0];
  };
}
