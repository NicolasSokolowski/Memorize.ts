import { poolConfig } from "../../database/pg.client";
import { Pool } from "pg";
import { app } from "../../index.app";
import request from "supertest";
import {
  UserCookie,
  createDeck,
  createAnotherDeck
} from "../helpers/test.helpers";
import { Password } from "../../helpers/Password";

const pool = new Pool(poolConfig);

describe("Card tests", () => {
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

  // ---------- POST /api/decks/:deck_id/cards ----------

  it("creates a card when providing correct data", async () => {
    const deck = await createDeck();

    await request(app)
      .post(`/api/decks/${deck.body.id}/cards`)
      .set("Cookie", UserCookie)
      .send({
        front: "test_front",
        back: "test_back"
      })
      .expect(201);
  });

  it("returns a 400 error when providing wrong data type", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .post(`/api/decks/${deck.body.id}/cards`)
      .set("Cookie", UserCookie)
      .send({
        front: 1, // Wrong data type
        back: 2 // Wrong data type
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Front must be a string" },
      { message: "Back must be a string" }
    ]);
  });

  it("returns a 400 error when some properties are missing", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .post(`/api/decks/${deck.body.id}/cards`)
      .set("Cookie", UserCookie)
      .send() // Missing properties
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Missing field front" },
      { message: "Missing field back" }
    ]);
  });

  it("returns a 400 error when properties sent are empty", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .post(`/api/decks/${deck.body.id}/cards`)
      .set("Cookie", UserCookie)
      .send({
        front: "", // Empty front
        back: "" // Empty back
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Front cannot be empty" },
      { message: "Back cannot be empty" }
    ]);
  });

  it("returns a 400 error when properties characters are above max length allowed", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .post(`/api/decks/${deck.body.id}/cards`)
      .set("Cookie", UserCookie)
      .send({
        front: "a".repeat(101), // More than 100 characters
        back: "b".repeat(101) // More than 100 characters
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Front must be at most 100 characters long" },
      { message: "Back must be at most 100 characters long" }
    ]);
  });

  it("returns a 403 error when user tries to create a card in a deck that does not belong to him", async () => {
    const anotherUserDeck = await createAnotherDeck();

    const response = await request(app)
      .post(`/api/decks/${anotherUserDeck.body.id}/cards`) // Another user's deck
      .set("Cookie", UserCookie)
      .send({
        front: "another_card_front",
        back: "another_card_back"
      })
      .expect(403);

    expect(response.body.errors).toEqual([
      { message: "You do not own this deck." }
    ]);
  });
});
