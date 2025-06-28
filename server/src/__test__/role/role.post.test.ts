import { poolConfig } from "../../database/pg.client";
import { Pool } from "pg";
import request from "supertest";
import { app } from "../../index.app";
import { AdminCookie } from "../helpers/test.helpers";
import { Password } from "../../helpers/Password";

const pool = new Pool(poolConfig);

describe("Role tests", () => {
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

  afterEach(async () => {
    await pool.query(`DELETE FROM "role" WHERE name = 'test_role'`);
  });

  afterAll(async () => {
    await pool.query(`TRUNCATE TABLE "user" RESTART IDENTITY CASCADE`);
    await pool.end();
  });

  // ---------- POST /api/users/roles ----------

  it("creates a role when providing correct data", async () => {
    await request(app)
      .post("/api/users/roles")
      .set("Cookie", AdminCookie)
      .send({
        name: "test_role"
      })
      .expect(201);
  });

  it("returns a 400 error when providing wrong data type", async () => {
    const response = await request(app)
      .post("/api/users/roles")
      .set("Cookie", AdminCookie)
      .send({
        name: 1 // Wrong data type
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Name must be a string", field: "name" }
    ]);
  });

  it("returns a 400 error when name field is not provided", async () => {
    const response = await request(app)
      .post("/api/users/roles")
      .set("Cookie", AdminCookie)
      .send()
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Missing field name", field: "name" }
    ]);
  });

  it("returns a 400 error when name field is empty", async () => {
    const response = await request(app)
      .post("/api/users/roles")
      .set("Cookie", AdminCookie)
      .send({
        name: "" // Empty name
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Name cannot be empty", field: "name" }
    ]);
  });

  it("returns a 400 error when name is less then 3 characters", async () => {
    const response = await request(app)
      .post("/api/users/roles")
      .set("Cookie", AdminCookie)
      .send({
        name: "ch" // Less than 3 characters
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Name must be at least 3 characters long", field: "name" }
    ]);
  });

  it("returns a 400 error when name is more than 15 characters", async () => {
    const response = await request(app)
      .post("/api/users/roles")
      .set("Cookie", AdminCookie)
      .send({
        name: "super_long_admin_role_name_for_no_test_purposes" // Less than 3 characters
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Name must be at most 15 characters long", field: "name" }
    ]);
  });

  it("returns an error when provided  role name already exists", async () => {
    const response = await request(app)
      .post("/api/users/roles")
      .set("Cookie", AdminCookie)
      .send({
        name: "user" // Existing role name
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Provided item already exists." }
    ]);
  });
});
