import { poolConfig } from "../../database/pg.client";
import { Pool } from "pg";
import request from "supertest";
import { app } from "../../index.app";
import {
  createUser,
  mockCookie,
  mockUserAccessToken,
  UserCookie
} from "../helpers/test.helpers";

const pool = new Pool(poolConfig);

describe("User GET tests", () => {
  beforeAll(async () => {
    await pool.query(
      `INSERT INTO "user" ("email", "password", "username", "role_id") VALUES ('user@user.com', 'pAssw0rd!123', 'test_user', 2) ON CONFLICT DO NOTHING`
    );
    await pool.query(
      `INSERT INTO "user" ("email", "password", "username", "role_id") VALUES ('admin@admin.com', 'pAssw0rd!123', 'test_admin', 1) ON CONFLICT DO NOTHING`
    );
  });

  afterAll(async () => {
    await pool.query(`TRUNCATE TABLE "user" RESTART IDENTITY CASCADE`);
    await pool.end();
  });

  // ---------- DELETE /api/profile ----------

  it("deletes the user profile when providing correct data", async () => {
    const response = await request(app)
      .delete("/api/profile")
      .set("Cookie", UserCookie)
      .expect(200);

    expect(response.body.message).toBe("Account deleted successfully");

    const userCheck = await pool.query(
      `SELECT * FROM "user" WHERE email = 'user@user.com'`
    );

    expect(userCheck.rows.length).toBe(0);
  });

  it("returns a 401 error when trying to delete the profile without an access token", async () => {
    const response = await request(app).delete("/api/profile").expect(401);

    expect(response.body.errors).toEqual([{ message: "Not authorized" }]);
  });

  it("returns a 404 error when trying to delete an already deleted profile", async () => {
    const user = await createUser();
    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    // First delete the profile
    await request(app).delete("/api/profile").set("Cookie", cookie).expect(200);

    // Then try to delete it again
    const response = await request(app)
      .delete("/api/profile")
      .set("Cookie", cookie)
      .expect(404);

    expect(response.body.errors).toEqual([{ message: "Not Found" }]);
  });
});
