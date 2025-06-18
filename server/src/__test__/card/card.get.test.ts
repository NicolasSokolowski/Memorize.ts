import { poolConfig } from "../../database/pg.client";
import { Pool } from "pg";
import { app } from "../../index.app";
import request from "supertest";
import {
  UserCookie,
  createCard,
  createDeck,
  createUser,
  makeRandomString,
  mockCookie,
  mockUserAccessToken
} from "../helpers/test.helpers";

const pool = new Pool(poolConfig);

describe("Card tests", () => {
  beforeAll(async () => {
    await pool.query(
      `INSERT INTO "user" ("email", "password", "username", "role_id") VALUES ('user@user.com', 'pAssw0rd!123', 'test_user', 2) ON CONFLICT DO NOTHING`
    );
    await pool.query(
      `INSERT INTO "user" ("email", "password", "username", "role_id") VALUES ('admin@admin.com', 'pAssw0rd!123', 'test_admin', 1) ON CONFLICT DO NOTHING`
    );
  });

  afterEach(async () => {
    await pool.query(`DELETE FROM "card";`);
    await pool.query(`DELETE FROM "deck";`);
  });

  afterAll(async () => {
    await pool.query(
      `DELETE FROM "user" WHERE email IN ('user@user.com', 'admin@admin.com');`
    );
    await pool.end();
  });

  // ---------- GET /api/decks/:deck_id/cards ----------

  it("returns all cards for the deck", async () => {
    const deck = await createDeck();
    const anotherDeck = await createDeck();

    const response = await request(app)
      .get(`/api/decks/${deck.body.id}/cards`)
      .set("Cookie", UserCookie)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0); // Initially, no cards should be present

    // Create a card in the first deck
    await request(app)
      .post(`/api/decks/${deck.body.id}/cards`)
      .set("Cookie", UserCookie)
      .send({
        front: "test_front",
        back: "test_back"
      })
      .expect(201);

    // Create a card in the second deck
    await request(app)
      .post(`/api/decks/${anotherDeck.body.id}/cards`)
      .set("Cookie", UserCookie)
      .send({
        front: "another_front",
        back: "another_back"
      })
      .expect(201);

    // Fetch cards for the first deck again
    const updatedResponse = await request(app)
      .get(`/api/decks/${deck.body.id}/cards`)
      .set("Cookie", UserCookie)
      .expect(200);

    expect(updatedResponse.body.length).toBe(1);
    expect(updatedResponse.body[0].front).toBe("test_front");
  });

  it("returns an empty array if no cards exist for the deck", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .get(`/api/decks/${deck.body.id}/cards`)
      .set("Cookie", UserCookie)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);
  });

  it("returns a 404 error if the deck does not exist", async () => {
    const response = await request(app)
      .get("/api/decks/999999/cards") // Non-existent deck ID
      .set("Cookie", UserCookie)
      .expect(404);

    expect(response.body.errors).toEqual([{ message: "Not Found" }]);
  });

  it("returns a 400 error if the deck ID is invalid", async () => {
    const response = await request(app)
      .get("/api/decks/invalid_id/cards")
      .set("Cookie", UserCookie)
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Invalid deck ID provided." }
    ]);
  });

  it("returns a 401 error if the user is not authenticated", async () => {
    const response = await request(app)
      .get("/api/decks/1/cards") // Assuming user with ID 1 exists
      .expect(401);

    expect(response.body.errors).toEqual([{ message: "Not authorized" }]);
  });

  it("returns a 403 error if the user tries to access cards from a deck they do not own", async () => {
    const user = await createUser();
    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const anotherDeck = await request(app)
      .post("/api/decks")
      .set("Cookie", cookie)
      .send({
        name: makeRandomString(10)
      })
      .expect(201);

    const response = await request(app)
      .get(`/api/decks/${anotherDeck.body.id}/cards`)
      .set("Cookie", UserCookie) // Assuming this user does not own the deck
      .expect(403);

    expect(response.body.errors).toEqual([
      { message: "You do not own this deck." }
    ]);
  });

  // ---------- GET /api/decks/:deck_id/cards/:card_id ----------

  it("returns a specific card by ID", async () => {
    const deck = await createDeck();

    // Create a card in the deck
    const card = await createCard(deck.body.id);

    const cardId = card.body.id;

    // Fetch the specific card
    const response = await request(app)
      .get(`/api/decks/${deck.body.id}/cards/${cardId}`)
      .set("Cookie", UserCookie)
      .expect(200);

    expect(response.body.id).toBe(cardId);
    expect(response.body.front).toBe(card.body.front);
    expect(response.body.back).toBe(card.body.back);
  });

  it("returns a 404 error if the card does not exist", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .get(`/api/decks/${deck.body.id}/cards/999999`) // Non-existent card ID
      .set("Cookie", UserCookie)
      .expect(404);

    expect(response.body.errors).toEqual([{ message: "Not Found" }]);
  });

  it("returns a 400 error if the card ID is invalid", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .get(`/api/decks/${deck.body.id}/cards/invalid_id`)
      .set("Cookie", UserCookie)
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Invalid card ID provided." }
    ]);
  });

  it("returns a 401 error if the user is not authenticated", async () => {
    const deck = await createDeck();
    const card = await createCard(deck.body.id);

    const response = await request(app)
      .get(`/api/decks/${deck.body.id}/cards/${card.body.id}`)
      .expect(401);

    expect(response.body.errors).toEqual([{ message: "Not authorized" }]);
  });

  it("returns a 403 error if the user tries to access a card from a deck he doesn't own", async () => {
    const user = await createUser();
    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const anotherDeck = await request(app)
      .post("/api/decks")
      .set("Cookie", cookie)
      .send({
        name: makeRandomString(10)
      })
      .expect(201);

    const card = await request(app)
      .post(`/api/decks/${anotherDeck.body.id}/cards`)
      .set("Cookie", cookie)
      .send({
        front: "test_front",
        back: "test_back"
      })
      .expect(201);

    const response = await request(app)
      .get(`/api/decks/${anotherDeck.body.id}/cards/${card.body.id}`)
      .set("Cookie", UserCookie) // Assuming this user does not own the deck
      .expect(403);

    expect(response.body.errors).toEqual([
      { message: "You do not own this deck." }
    ]);
  });

  it("returns a 403 error if the user tries to access a card he doesn't own", async () => {
    const deck = await createDeck();
    const card = await createCard(deck.body.id);

    // Attempt to access the card with a different user
    const anotherUser = await createUser();
    const anotherAccessToken = mockUserAccessToken(anotherUser.body.user.email);
    const anotherCookie = mockCookie(anotherAccessToken);

    const anotherDeck = await request(app)
      .post("/api/decks")
      .set("Cookie", anotherCookie)
      .send({
        name: makeRandomString(10)
      })
      .expect(201);

    const response = await request(app)
      .get(`/api/decks/${anotherDeck.body.id}/cards/${card.body.id}`)
      .set("Cookie", anotherCookie) // Different user
      .expect(403);

    expect(response.body.errors).toEqual([
      { message: "You do not own this card." }
    ]);
  });

  // ---------- GET /api/users/me/cards ----------

  it("returns all cards for the authenticated user", async () => {
    const deck = await createDeck();
    const deckTwo = await createDeck();
    await createCard(deck.body.id);
    await createCard(deck.body.id);
    await createCard(deck.body.id);
    await createCard(deckTwo.body.id);

    const response = await request(app)
      .get("/api/users/me/cards")
      .set("Cookie", UserCookie)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(4); // Should return all cards created by the user
  });

  it("returns an empty array if the user has no cards when trying to fetch all cards by user", async () => {
    const response = await request(app)
      .get("/api/users/me/cards")
      .set("Cookie", UserCookie)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0); // No cards created yet
  });

  it("returns a 401 error if the user is not authenticated when trying to fetch all cards by user", async () => {
    const response = await request(app).get("/api/users/me/cards").expect(401);

    expect(response.body.errors).toEqual([{ message: "Not authorized" }]);
  });

  it("returns a 401 error if the access token is invalid when trying to fetch all cards by user", async () => {
    const response = await request(app)
      .get("/api/users/me/cards")
      .set("Cookie", "invalid_token")
      .expect(401);

    expect(response.body.errors).toEqual([{ message: "Not authorized" }]);
  });
});
