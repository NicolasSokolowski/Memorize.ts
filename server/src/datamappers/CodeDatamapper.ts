import { pool } from "../database/pg.client";
import { TableNames } from "../helpers/TableNames";
import { CoreDatamapper } from "./CoreDatamapper";
import { CodeData, CodeDatamapperReq } from "./interfaces/CodeDatamapperReq";

export class CodeDatamapper
  extends CoreDatamapper<CodeData>
  implements CodeDatamapperReq
{
  readonly tableName = TableNames.Code;
  pool = pool;

  checkCompositeKey = async (requestType: string, userId: number) => {
    const result = await this.pool.query(
      `SELECT * FROM "${this.tableName}" 
      WHERE request_type = $1 
        AND user_id = $2`,
      [requestType, userId]
    );
    return result.rows[0];
  };
}
