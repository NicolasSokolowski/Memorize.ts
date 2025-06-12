import { poolConfig } from "../../database/pg.client";
import { Pool } from "pg";
import request from "supertest";
import { app } from "../../index.app";
import {
  createDeck,
  createUser,
  mockCookie,
  mockUserAccessToken,
  UserCookie
} from "../helpers/test.helpers";

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

  // ---------- PUT /api/decks/:deck_id ----------

  it("updates a deck when providing correct data", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .put(`/api/decks/${deck.body.id}`)
      .set("Cookie", UserCookie)
      .send({
        name: "updated_deck"
      })
      .expect(200);

    expect(response.body.name).toBe("updated_deck");
    expect(response.body.id).toBe(deck.body.id);
  });

  it("returns an error when trying to update a deck that does not exist", async () => {
    const response = await request(app)
      .put(`/api/decks/9999`)
      .set("Cookie", UserCookie)
      .send({
        name: "updated_deck"
      })
      .expect(404);

    expect(response.body.errors).toEqual([{ message: "Not Found" }]);
  });

  it("returns an error when trying to update a deck with an already existing name for the same user", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .put(`/api/decks/${deck.body.id}`)
      .set("Cookie", UserCookie)
      .send({
        name: `${deck.body.name}`
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: `A deck with the name "${deck.body.name}" already exists.` }
    ]);
  });

  it("returns a 403 error when trying to update another user's deck", async () => {
    const deck = await createDeck();
    const anotherUser = await createUser();

    const accessToken = mockUserAccessToken(anotherUser.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .put(`/api/decks/${deck.body.id}`)
      .set("Cookie", cookie)
      .send({
        name: "updated_deck"
      })
      .expect(403);

    expect(response.body.errors).toEqual([
      { message: "You do not own this deck." }
    ]);
  });

  it("returns a 401 error when trying to update a deck without an access token", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .put(`/api/decks/${deck.body.id}`)
      .send({
        name: "updated_deck"
      })
      .expect(401);

    expect(response.body.errors).toEqual([{ message: "Not authorized" }]);
  });

  it("returns a 400 error when trying to update a deck with an invalid ID", async () => {
    const response = await request(app)
      .put("/api/decks/invalid_id")
      .set("Cookie", UserCookie)
      .send({
        name: "updated_deck"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Invalid deck ID provided." }
    ]);
  });

  it("returns a 400 error when trying to update a deck with an empty name", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .put(`/api/decks/${deck.body.id}`)
      .set("Cookie", UserCookie)
      .send({
        name: ""
      })
      .expect(400);

    expect(response.body.errors).toEqual([{ message: "Name cannot be empty" }]);
  });

  it("returns a 400 error when trying to update a deck with a name longer than 50 characters", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .put(`/api/decks/${deck.body.id}`)
      .set("Cookie", UserCookie)
      .send({
        name: "a".repeat(51) // 51 characters long
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Name must be at most 50 characters long" }
    ]);
  });

  it("returns a 400 error when trying to update a deck with a wrong data type for name", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .put(`/api/decks/${deck.body.id}`)
      .set("Cookie", UserCookie)
      .send({
        name: 123 // Wrong data type
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Name must be a string" }
    ]);
  });

  it("returns a 400 error when trying to update a deck without providing a name", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .put(`/api/decks/${deck.body.id}`)
      .set("Cookie", UserCookie)
      .send({})
      .expect(400);

    expect(response.body.errors).toEqual([{ message: "Missing field name" }]);
  });
});
