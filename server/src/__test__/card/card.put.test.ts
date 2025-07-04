import { poolConfig } from "../../database/pg.client";
import { Pool } from "pg";
import { app } from "../../index.app";
import request from "supertest";
import {
  UserCookie,
  createDeck,
  createCard,
  createUser,
  mockUserAccessToken,
  mockCookie
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

  afterEach(async () => {
    await pool.query(`DELETE FROM "deck" WHERE name = 'test_deck'`);
    await pool.query(`DELETE FROM "card" WHERE front = 'test_front'`);
  });

  afterAll(async () => {
    await pool.query(
      `DELETE FROM "user" WHERE email IN ('user@user.com', 'admin@admin.com');`
    );
    await pool.end();
  });

  // ---------- POST /api/decks/:deck_id/cards/:card_id ----------

  it("updates a card when providing correct data", async () => {
    const deck = await createDeck();
    const card = await createCard(deck.body.id);

    const response = await request(app)
      .put(`/api/decks/${deck.body.id}/cards/${card.body.id}`)
      .set("Cookie", UserCookie)
      .send({
        front: "updated_front",
        back: "updated_back"
      })
      .expect(200);

    expect(response.body.front).toBe("updated_front");
    expect(response.body.back).toBe("updated_back");
    expect(response.body.id).toBe(card.body.id);
  });

  it("returns an error when trying to update a card that does not exist", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .put(`/api/decks/${deck.body.id}/cards/9999`)
      .set("Cookie", UserCookie)
      .send({
        front: "updated_front",
        back: "updated_back"
      })
      .expect(404);

    expect(response.body.errors).toEqual([{ message: "Not Found" }]);
  });

  it("returns an error when trying to update a card with wrong data type", async () => {
    const deck = await createDeck();
    const card = await createCard(deck.body.id);

    const response = await request(app)
      .put(`/api/decks/${deck.body.id}/cards/${card.body.id}`)
      .set("Cookie", UserCookie)
      .send({
        front: 123, // Wrong data type
        back: 456 // Wrong data type
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Front must be a string", field: "front" },
      { message: "Back must be a string", field: "back" }
    ]);
  });

  it("returns a 403 error when trying to update another user's card", async () => {
    const deck = await createDeck();
    const anotherUser = await createUser();
    const accessToken = mockUserAccessToken(anotherUser.body.user.email);
    const cookie = mockCookie(accessToken);

    const anotherUserDeck = await request(app)
      .post("/api/decks")
      .set("Cookie", cookie)
      .send({
        name: "test_deck"
      })
      .expect(201);

    const anotherUserCard = await request(app)
      .post(`/api/decks/${anotherUserDeck.body.id}/cards`)
      .set("Cookie", cookie)
      .send({
        front: "test_front",
        back: "test_back"
      })
      .expect(201);

    const response = await request(app)
      .put(`/api/decks/${deck.body.id}/cards/${anotherUserCard.body.id}`)
      .set("Cookie", UserCookie)
      .send({
        front: "updated_front",
        back: "updated_back"
      })
      .expect(403);

    expect(response.body.errors).toEqual([
      { message: "You do not own this card." }
    ]);
  });

  it("returns a 400 error when trying to update a card with empty properties", async () => {
    const deck = await createDeck();
    const card = await createCard(deck.body.id);

    const response = await request(app)
      .put(`/api/decks/${deck.body.id}/cards/${card.body.id}`)
      .set("Cookie", UserCookie)
      .send({
        front: "", // Empty front
        back: "" // Empty back
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Front cannot be empty", field: "front" },
      { message: "Back cannot be empty", field: "back" }
    ]);
  });

  it("returns a 401 error when trying to update a card without an access token", async () => {
    const deck = await createDeck();
    const card = await createCard(deck.body.id);

    const response = await request(app)
      .put(`/api/decks/${deck.body.id}/cards/${card.body.id}`)
      .send({
        front: "updated_front",
        back: "updated_back"
      })
      .expect(401);

    expect(response.body.errors).toEqual([{ message: "Not authorized" }]);
  });

  it("returns a 400 error when trying to update a card with an invalid ID", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .put(`/api/decks/${deck.body.id}/cards/invalid_id`)
      .set("Cookie", UserCookie)
      .send({
        front: "updated_front",
        back: "updated_back"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Invalid card ID provided." }
    ]);
  });

  it("returns a 400 error when no properties are provided", async () => {
    const deck = await createDeck();
    const card = await createCard(deck.body.id);

    const response = await request(app)
      .put(`/api/decks/${deck.body.id}/cards/${card.body.id}`)
      .set("Cookie", UserCookie)
      .send() // No properties provided
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: '"value" must have at least 1 key' }
    ]);
  });
});
