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
      {
        message: "front must be a string",
        field: "front",
        code: "VALIDATION_ERROR",
        type: "string.base",
        context: {
          key: "front",
          label: "front",
          value: 1
        }
      },
      {
        message: "back must be a string",
        field: "back",
        code: "VALIDATION_ERROR",
        type: "string.base",
        context: {
          key: "back",
          label: "back",
          value: 2
        }
      }
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
      {
        message: '"front" is required',
        field: "front",
        code: "VALIDATION_ERROR",
        type: "any.required",
        context: {
          key: "front",
          label: "front"
        }
      },
      {
        message: '"back" is required',
        field: "back",
        code: "VALIDATION_ERROR",
        type: "any.required",
        context: {
          key: "back",
          label: "back"
        }
      }
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
      {
        message: "front cannot be empty",
        field: "front",
        code: "VALIDATION_ERROR",
        type: "string.empty",
        context: {
          key: "front",
          label: "front",
          value: ""
        }
      },
      {
        message: "back cannot be empty",
        field: "back",
        code: "VALIDATION_ERROR",
        type: "string.empty",
        context: {
          key: "back",
          label: "back",
          value: ""
        }
      }
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
      {
        message: "front must be at most 100 characters long",
        field: "front",
        code: "VALIDATION_ERROR",
        type: "string.max",
        context: {
          key: "front",
          label: "front",
          limit: 100,
          value: "a".repeat(101)
        }
      },
      {
        message: "back must be at most 100 characters long",
        field: "back",
        code: "VALIDATION_ERROR",
        type: "string.max",
        context: {
          key: "back",
          label: "back",
          limit: 100,
          value: "b".repeat(101)
        }
      }
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
      { message: "You do not own this deck", code: "ACCESS_DENIED" }
    ]);
  });
});
