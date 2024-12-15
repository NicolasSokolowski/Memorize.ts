import "dotenv/config";
import { Pool } from "pg";

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_DATABASE,
  POSTGRES_PORT,
  POSTGRES_TEST_DATABASE,
} = process.env;

const poolConfig = {
  connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST || "localhost"}:${POSTGRES_PORT ? parseInt(POSTGRES_PORT, 10) : 5432}/${process.env.NODE_ENV === "test" ? POSTGRES_TEST_DATABASE : POSTGRES_DATABASE}`,
};

const pool = new Pool(poolConfig);

export { pool };
