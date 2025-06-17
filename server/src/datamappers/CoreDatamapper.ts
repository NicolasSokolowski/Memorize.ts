import { Pool } from "pg";
import { TableNames } from "../helpers/TableNames";
import { EntityDatamapperReq } from "./interfaces/EntityDatamapperReq";

export abstract class CoreDatamapper<D> implements EntityDatamapperReq<D> {
  abstract tableName: TableNames;
  abstract pool: Pool;

  findByPk = async (id: number) => {
    const result = await this.pool.query(
      `SELECT * FROM "${this.tableName}" WHERE "id" = $1`,
      [id]
    );
    return result.rows[0];
  };

  findAll = async () => {
    const result = await this.pool.query(`SELECT * FROM "${this.tableName}";`);
    return result.rows;
  };

  findBySpecificField = async (field: string, value: string) => {
    const result = await this.pool.query(
      `SELECT * FROM "${this.tableName}" WHERE ${field} = $1`,
      [value]
    );
    return result.rows[0];
  };

  insert = async (entityObject: D) => {
    const columns = Object.keys(entityObject).join(", ");
    const values = Object.values(entityObject);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

    const query = `INSERT INTO "${this.tableName}" (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.pool.query(query, values);

    return result.rows[0];
  };

  delete = async (id: number) => {
    const result = await this.pool.query(
      `DELETE FROM "${this.tableName}" WHERE id = ($1) RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return { success: false, message: "Record not found" };
    }

    return result.rows[0];
  };
}
