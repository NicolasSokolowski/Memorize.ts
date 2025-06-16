import { poolConfig } from "../../database/pg.client";
import { Pool } from "pg";
import request from "supertest";
import { app } from "../../index.app";
import { UserCookie } from "../helpers/test.helpers";

const pool = new Pool(poolConfig);

describe("Deck tests", () => {
  beforeAll(async () => {
    await pool.query(
      `INSERT INTO "user" ("email", "password", "username", "role_id") VALUES ('user@user.com', 'pAssw0rd!123', 'test_user', 2) ON CONFLICT DO NOTHING`
    );
    await pool.query(
      `INSERT INTO "user" ("email", "password", "username", "role_id") VALUES ('admin@admin.com', 'pAssw0rd!123', 'test_admin', 1) ON CONFLICT DO NOTHING`
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
      { message: "Provided item already exists." }
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
      { message: "Name must be a string" }
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

    expect(response.body.errors).toEqual([{ message: "Name cannot be empty" }]);
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
      { message: "Name must be at most 50 characters long" }
    ]);
  });

  it("returns a 400 error when name field is not provided", async () => {
    const response = await request(app)
      .post("/api/decks")
      .set("Cookie", UserCookie)
      .send() // No name provided
      .expect(400);

    expect(response.body.errors).toEqual([{ message: "Missing field name" }]);
  });
});
