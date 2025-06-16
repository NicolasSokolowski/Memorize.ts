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

  // ---------- DELETE /api/decks/:deck_id ----------

  it("deletes a deck when providing a valid deck ID", async () => {
    const deck = await createDeck();

    await request(app)
      .delete(`/api/decks/${deck.body.id}`)
      .set("Cookie", UserCookie)
      .expect(200);

    const response = await request(app)
      .get(`/api/decks/${deck.body.id}`)
      .set("Cookie", UserCookie)
      .expect(404);

    expect(response.body.errors).toEqual([{ message: "Not Found" }]);
  });

  it("returns an error when trying to delete a deck that does not exist", async () => {
    const response = await request(app)
      .delete(`/api/decks/9999`)
      .set("Cookie", UserCookie)
      .expect(404);

    expect(response.body.errors).toEqual([{ message: "Not Found" }]);
  });

  it("returns an error when trying to delete a deck with an invalid ID", async () => {
    const response = await request(app)
      .delete(`/api/decks/invalid-id`)
      .set("Cookie", UserCookie)
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Invalid deck ID provided." }
    ]);
  });

  it("returns an error when trying to delete a deck with no access token", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .delete(`/api/decks/${deck.body.id}`)
      .expect(401);

    expect(response.body.errors).toEqual([{ message: "Not authorized" }]);
  });

  it("returns an error when trying to delete another user's deck", async () => {
    const deck = await createDeck();
    const anotherUser = await createUser();

    const accessTokenMock = mockUserAccessToken(anotherUser.body.user.email);
    const cookie = mockCookie(accessTokenMock);

    const response = await request(app)
      .delete(`/api/decks/${deck.body.id}`)
      .set("Cookie", cookie)
      .expect(403);

    expect(response.body.errors).toEqual([
      { message: "You do not own this deck." }
    ]);
  });

  it("deletes all cards associated with the deck when deleting a deck", async () => {
    const deck = await createDeck();
    const cardOne = await createCard(deck.body.id);
    const cardTwo = await createCard(deck.body.id);

    await request(app)
      .delete(`/api/decks/${deck.body.id}`)
      .set("Cookie", UserCookie)
      .expect(200);

    const responseOne = await request(app)
      .get(`/api/decks/${deck.body.id}/cards/${cardOne.body.id}`)
      .set("Cookie", UserCookie)
      .expect(404);

    const responseTwo = await request(app)
      .get(`/api/decks/${deck.body.id}/cards/${cardTwo.body.id}`)
      .set("Cookie", UserCookie)
      .expect(404);

    expect(responseOne.body.errors).toEqual([{ message: "Not Found" }]);
    expect(responseTwo.body.errors).toEqual([{ message: "Not Found" }]);
  });
});
