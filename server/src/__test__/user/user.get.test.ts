import { poolConfig } from "../../database/pg.client";
import { Pool } from "pg";
import request from "supertest";
import { app } from "../../index.app";
import { AdminCookie, UserCookie } from "../helpers/test.helpers";

const pool = new Pool(poolConfig);

describe("Role tests", () => {
  beforeAll(async () => {
    await pool.query(
      `INSERT INTO "user" ("email", "password", "username", "role_id") VALUES ('user@user.com', 'pAssw0rd!123', 'test_user', 2) ON CONFLICT DO NOTHING`
    );
    await pool.query(
      `INSERT INTO "user" ("email", "password", "username", "role_id") VALUES ('admin@admin.com', 'pAssw0rd!123', 'test_admin', 1) ON CONFLICT DO NOTHING`
    );
  });

  afterEach(async () => {
    await pool.query(`DELETE FROM "role" WHERE name = 'test_role'`);
  });

  afterAll(async () => {
    await pool.query(`TRUNCATE TABLE "user" RESTART IDENTITY CASCADE`);
    await pool.end();
  });

  // ---------- GET /api/users ----------

  it("returns a list of users", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("Cookie", AdminCookie)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(2); // At least admin and user
  });

  it("returns a 403 error when trying to fetch users as a user", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("Cookie", UserCookie)
      .expect(403);

    expect(response.body.errors).toEqual([
      {
        message: "Not enough permissions"
      }
    ]);
  });

  it("returns a 401 error when trying to fetch users without an access token", async () => {
    const response = await request(app).get("/api/users").expect(401);

    expect(response.body.errors).toEqual([
      {
        message: "Not authorized"
      }
    ]);
  });

  // ---------- GET /api/profile ----------

  it("returns the profile of the authenticated user", async () => {
    const response = await request(app)
      .get("/api/profile")
      .set("Cookie", UserCookie)
      .expect(200);

    expect(response.body.user.email).toBe("user@user.com");
    expect(response.body.user.username).toBe("test_user");
  });

  it("returns a 401 error when trying to fetch profile without an access token", async () => {
    const response = await request(app).get("/api/profile").expect(401);

    expect(response.body.errors).toEqual([
      {
        message: "Not authorized"
      }
    ]);
  });
});
