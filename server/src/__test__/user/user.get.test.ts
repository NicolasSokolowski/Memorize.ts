import { poolConfig } from "../../database/pg.client";
import { Pool } from "pg";
import request from "supertest";
import { app } from "../../index.app";
import { AdminCookie, createUser, UserCookie } from "../helpers/test.helpers";
import { Password } from "../../helpers/Password";

const pool = new Pool(poolConfig);

describe("User GET tests", () => {
  beforeAll(async () => {
    const hashedPassword = await Password.toHash("pAssw0rd!123");

    await pool.query(
      `INSERT INTO "user" ("email", "password", "username", "role_id")
     VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
      ["user@user.com", hashedPassword, "test_user", 2]
    );

    await pool.query(
      `INSERT INTO "user" ("email", "password", "username", "role_id")
     VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
      ["admin@admin.com", hashedPassword, "test_admin", 1]
    );
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
        message: "Not enough permissions",
        code: "ACCESS_DENIED"
      }
    ]);
  });

  it("returns a 401 error when trying to fetch users without an access token", async () => {
    const response = await request(app).get("/api/users").expect(401);

    expect(response.body.errors).toEqual([
      {
        message: "Not authorized",
        code: "UNAUTHORIZED"
      }
    ]);
  });

  // ---------- GET /api/users/:user_id ----------

  it("returns a user by ID", async () => {
    const user = await createUser();

    const response = await request(app)
      .get(`/api/users/${user.body.user.id}`)
      .set("Cookie", AdminCookie)
      .expect(200);

    expect(response.body.email).toBe(user.body.user.email);
  });

  it("returns a 404 error when trying to fetch a non-existing user", async () => {
    const response = await request(app)
      .get("/api/users/9999") // Assuming this ID does not exist
      .set("Cookie", AdminCookie)
      .expect(404);

    expect(response.body.errors).toEqual([
      {
        message: "Item not found",
        code: "NOT_FOUND"
      }
    ]);
  });

  it("returns a 403 error when trying to fetch a user as a regular user", async () => {
    const response = await request(app)
      .get("/api/users/1") // Assuming user with ID 1 exists
      .set("Cookie", UserCookie)
      .expect(403);

    expect(response.body.errors).toEqual([
      {
        message: "Not enough permissions",
        code: "ACCESS_DENIED"
      }
    ]);
  });

  it("returns a 401 error when trying to fetch a user without an access token", async () => {
    const response = await request(app).get("/api/users/1").expect(401);

    expect(response.body.errors).toEqual([
      {
        message: "Not authorized",
        code: "UNAUTHORIZED"
      }
    ]);
  });

  it("returns a 400 error when trying to fetch a user with an invalid ID", async () => {
    const response = await request(app)
      .get("/api/users/invalid_id")
      .set("Cookie", AdminCookie)
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "ID parameter is missing",
        code: "INVALID_PARAMETER"
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
        message: "Not authorized",
        code: "UNAUTHORIZED"
      }
    ]);
  });
});
