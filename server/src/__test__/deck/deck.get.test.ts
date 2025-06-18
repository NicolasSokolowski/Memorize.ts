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
import { DeckData } from "../../datamappers/interfaces/DeckDatamapperReq";
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

  // ---------- GET /api/decks ----------

  it("returns all decks for the user", async () => {
    const deckOne = await createDeck();
    const deckTwo = await createDeck();

    const response = await request(app)
      .get("/api/decks")
      .set("Cookie", UserCookie)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(2);

    const deckIds = response.body.map((deck: DeckData) => deck.id);

    expect(deckIds).toContain(deckOne.body.id);
    expect(deckIds).toContain(deckTwo.body.id);
  });

  it("returns an empty array if no decks exist for the user", async () => {
    const user = await createUser();
    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .get("/api/decks")
      .set("Cookie", cookie)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);
  });

  it("returns an error if the user is not authenticated", async () => {
    const response = await request(app).get("/api/decks").expect(401);

    expect(response.body.errors).toEqual([{ message: "Not authorized" }]);
  });

  it("returns an error if the cookie doesn't contain a valid access token", async () => {
    const response = await request(app)
      .get("/api/decks")
      .set("Cookie", mockCookie("invalid-token"))
      .expect(401);

    expect(response.body.errors).toEqual([{ message: "Not authorized" }]);
  });

  // ---------- GET /api/decks/:deck_id ----------

  it("returns a deck by ID", async () => {
    const deck = await createDeck();

    const response = await request(app)
      .get(`/api/decks/${deck.body.id}`)
      .set("Cookie", UserCookie)
      .expect(200);

    expect(response.body.id).toBe(deck.body.id);
    expect(response.body.name).toBe(deck.body.name);
  });

  it("returns a 404 error when trying to fetch a non-existing deck", async () => {
    const response = await request(app)
      .get("/api/decks/9999") // Assuming this ID does not exist
      .set("Cookie", UserCookie)
      .expect(404);

    expect(response.body.errors).toEqual([{ message: "Not Found" }]);
  });

  it("returns a 400 error when trying to fetch a deck with an invalid ID", async () => {
    const response = await request(app)
      .get("/api/decks/invalid_id")
      .set("Cookie", UserCookie)
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Invalid deck ID provided." }
    ]);
  });

  it("returns a 401 error when trying to fetch a deck without an access token", async () => {
    const response = await request(app)
      .get("/api/decks/1") // Assuming user with ID 1 exists
      .expect(401);

    expect(response.body.errors).toEqual([{ message: "Not authorized" }]);
  });

  it("returns a 403 error when trying to fetch another user's deck", async () => {
    const deck = await createDeck();
    const anotherUser = await createUser();

    const accessTokenMock = mockUserAccessToken(anotherUser.body.user.email);
    const cookie = mockCookie(accessTokenMock);

    const response = await request(app)
      .get(`/api/decks/${deck.body.id}`)
      .set("Cookie", cookie)
      .expect(403);

    expect(response.body.errors).toEqual([
      { message: "You do not own this deck." }
    ]);
  });
});
