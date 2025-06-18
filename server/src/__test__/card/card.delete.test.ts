import { poolConfig } from "../../database/pg.client";
import { Pool } from "pg";
import request from "supertest";
import { app } from "../../index.app";
import {
  createCard,
  createDeck,
  createUser,
  mockCookie,
  mockUserAccessToken,
  UserCookie
} from "../helpers/test.helpers";
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

  // ---------- DELETE /api/decks/:deck_id/cards/:card_id ----------

  it("deletes a card from a deck when providing a valid deck ID and card ID", async () => {
    const deck = await createDeck();
    const card = await createCard(deck.body.id);

    const responseOne = await request(app)
      .delete(`/api/decks/${deck.body.id}/cards/${card.body.id}`)
      .set("Cookie", UserCookie)
      .expect(200);

    expect(responseOne.body).toEqual({
      success: true,
      message: "Item successfully deleted."
    });

    const responseTwo = await request(app)
      .get(`/api/decks/${deck.body.id}/cards/${card.body.id}`)
      .set("Cookie", UserCookie)
      .expect(404);

    expect(responseTwo.body.errors).toEqual([{ message: "Not Found" }]);
  });

  it("returns an error when trying to delete a card that does not exist in the deck", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .delete(`/api/decks/${deck.body.id}/cards/9999`)
      .set("Cookie", UserCookie)
      .expect(404);

    expect(response.body.errors).toEqual([{ message: "Not Found" }]);
  });

  it("returns an error when trying to delete a card with an invalid ID", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .delete(`/api/decks/${deck.body.id}/cards/invalid_id`)
      .set("Cookie", UserCookie)
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Invalid card ID provided." }
    ]);
  });

  it("returns an error when trying to delete a card with no access token", async () => {
    const deck = await createDeck();
    const card = await createCard(deck.body.id);

    const response = await request(app)
      .delete(`/api/decks/${deck.body.id}/cards/${card.body.id}`)
      .expect(401);

    expect(response.body.errors).toEqual([{ message: "Not authorized" }]);
  });

  it("returns an error when trying to delete another user's card", async () => {
    const deck = await createDeck();
    const anotherUser = await createUser();
    const accessTokenMock = mockUserAccessToken(anotherUser.body.user.email);
    const cookie = mockCookie(accessTokenMock);

    const anotherUserDeck = await request(app) // Create another user's deck
      .post("/api/decks")
      .set("Cookie", cookie)
      .send({
        name: "another_user_deck"
      })
      .expect(201);

    const anotherUserCard = await request(app) // Create another user's card
      .post(`/api/decks/${anotherUserDeck.body.id}/cards`)
      .set("Cookie", cookie)
      .send({
        front: "test_front",
        back: "test_back"
      })
      .expect(201);

    const response = await request(app)
      .delete(`/api/decks/${deck.body.id}/cards/${anotherUserCard.body.id}`) // Attempt to delete another user's card
      .set("Cookie", UserCookie)
      .expect(403);

    expect(response.body.errors).toEqual([
      { message: "You do not own this card." }
    ]);
  });

  it("returns an error when trying to delete a card from a deck that does not belong to the user", async () => {
    const deck = await createDeck();
    const card = await createCard(deck.body.id);
    const user = await createUser();

    const accessTokenMock = mockUserAccessToken(user.body.user.email);
    const anotherUserCookie = mockCookie(accessTokenMock);

    const response = await request(app)
      .delete(`/api/decks/${deck.body.id}/cards/${card.body.id}`)
      .set("Cookie", anotherUserCookie) // Another user's cookie
      .expect(403);

    expect(response.body.errors).toEqual([
      { message: "You do not own this deck." }
    ]);
  });
});
