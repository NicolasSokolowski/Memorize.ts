/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool } from "pg";
import { TableNames } from "../../helpers/TableNames";

export interface EntityDatamapperReq<D = any> {
  tableName: TableNames;
  pool: Pool;
  findByPk(id: number): Promise<D>;
  findAll(): Promise<D[]>;
  findBySpecificField(field: string, value: string): Promise<D>;
  insert(item: D): Promise<D>;
  delete(id: number): Promise<D>;
}
