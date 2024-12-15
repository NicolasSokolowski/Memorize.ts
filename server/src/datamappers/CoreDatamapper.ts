import { EntityDatamapperReq } from "./interfaces/EntityDatamapperReq";

export abstract class CoreDatamapper<T extends EntityDatamapperReq> {
  abstract tableName: T["tableName"];
  abstract pool: T["pool"];

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

  insert = async (entityObject: T["data"]) => {
    const columns = Object.keys(entityObject).join(", ");
    const values = Object.values(entityObject);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

    const query = `INSERT INTO "${this.tableName}" (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.pool.query(query, values);

    return result.rows[0];
  };

  update = async (entityObject: T["data"]) => {
    const id = entityObject["id"];

    if (!id) {
      throw new Error("Object must contain an id.");
    }

    const columns = Object.keys(entityObject).filter((key) => key !== "id");
    const values = columns.map((key) => entityObject[key]);

    const assignments = columns
      .map((col, index) => `${col} = $${index + 1}`)
      .join(", ");

    values.push(id);

    const query = `UPDATE ${this.tableName} SET ${assignments} WHERE id = $${values.length} RETURNING *`;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  };

  delete = async (id: number) => {
    const result = await this.pool.query(
      `DELETE FROM ${this.tableName} WHERE id = ($1)`,
      [id]
    );

    if (result.rowCount === 0) {
      return { success: false, message: "Record not found" };
    }

    return { success: true };
  };
}
