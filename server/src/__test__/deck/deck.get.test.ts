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
import { DeckDatamapperReq } from "../../datamappers/interfaces/DeckDatamapperReq";

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

    const deckIds = response.body.map(
      (deck: DeckDatamapperReq["data"]) => deck.id
    );

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
});
