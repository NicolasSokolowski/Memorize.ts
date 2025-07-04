import { poolConfig } from "../../database/pg.client";
import { Pool } from "pg";
import request from "supertest";
import { app } from "../../index.app";
import { UserCookie } from "../helpers/test.helpers";
import { Password } from "../../helpers/Password";

const pool = new Pool(poolConfig);

describe("Deck tests", () => {
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
    await pool.query(
      `DELETE FROM "user" WHERE email IN ('user@user.com', 'admin@admin.com');`
    );
    await pool.end();
  });

  afterEach(async () => {
    await pool.query(`DELETE FROM "deck" WHERE name = 'test_deck'`);
  });

  // ---------- POST /api/decks ----------

  it("creates a deck when providing correct data", async () => {
    await request(app)
      .post("/api/decks")
      .set("Cookie", UserCookie)
      .send({
        name: "test_deck"
      })
      .expect(201);
  });

  it("returns an error when providing an already existing deck name for the same user", async () => {
    await request(app)
      .post("/api/decks")
      .set("Cookie", UserCookie)
      .send({
        name: "test_deck"
      })
      .expect(201);

    const response = await request(app)
      .post("/api/decks")
      .set("Cookie", UserCookie)
      .send({
        name: "test_deck"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Name already exists in this deck.", field: "name" }
    ]);
  });

  it("returns a 400 error when providing a wrong data type", async () => {
    const response = await request(app)
      .post("/api/decks")
      .set("Cookie", UserCookie)
      .send({
        name: 1 // Wrong data type
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Name must be a string", field: "name" }
    ]);
  });

  it("returns a 400 error when providing an empty deck name", async () => {
    const response = await request(app)
      .post("/api/decks")
      .set("Cookie", UserCookie)
      .send({
        name: "" // Empty name
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Name cannot be empty", field: "name" }
    ]);
  });

  it("returns a 400 error when providing a name with more than 50 characters", async () => {
    const response = await request(app)
      .post("/api/decks")
      .set("Cookie", UserCookie)
      .send({
        name: "deck_name_with_more_than_fifty_characters_is_not_allowed_in_this_case_1234567890" // More than 50 characters
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Name must be at most 50 characters long", field: "name" }
    ]);
  });

  it("returns a 400 error when name field is not provided", async () => {
    const response = await request(app)
      .post("/api/decks")
      .set("Cookie", UserCookie)
      .send() // No name provided
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Missing field name", field: "name" }
    ]);
  });
});
