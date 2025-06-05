import { pool } from "../../database/pg.client";
import request from "supertest";
import { app } from "../../index.app";
import { UserCookie } from "../helpers/test.helpers";

describe("Role tests", () => {
  afterEach(async () => {
    await pool.query(`DELETE FROM "role" WHERE name = 'test_role'`);
  });

  it("creates a role", async () => {
    await request(app)
      .post("/api/users/role")
      .set("Cookie", UserCookie)
      .send({
        name: "test_role",
      })
      .expect(201);
  });
});
