import "dotenv/config";
import { Pool } from "pg";

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_DATABASE,
  POSTGRES_PORT
} = process.env;

export const poolConfig = {
  connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST || "localhost"}:${POSTGRES_PORT ? parseInt(POSTGRES_PORT, 10) : 5432}/${POSTGRES_DATABASE}`
};

const pool = new Pool(poolConfig);

export { pool };
