import { pool } from "../database/pg.client";
import { TableNames } from "../helpers/TableNames";
import { CoreDatamapper } from "./CoreDatamapper";
import { RoleData, RoleDatamapperReq } from "./interfaces/RoleDatamapperReq";

export class RoleDatamapper
  extends CoreDatamapper<RoleData>
  implements RoleDatamapperReq
{
  readonly tableName = TableNames.Role;
  pool = pool;

  update = async (data: RoleData, emailCookie: string): Promise<RoleData> => {
    const { name } = data;
    const result = await this.pool.query(
      `UPDATE "${this.tableName}" SET name = $1 WHERE email = $2 RETURNING *`,
      [name, emailCookie]
    );
    return result.rows[0];
  };
}
