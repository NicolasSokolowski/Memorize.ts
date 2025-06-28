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

  afterAll(async () => {
    await pool.query(
      `DELETE FROM "user" WHERE email IN ('user@user.com', 'admin@admin.com');`
    );
    await pool.end();
  });

  // ---------- POST /api/users/me/cards ----------

  it("processes due cards (next_occurrence = 0) based on user answers", async () => {
    const deck = await createDeck();
    const cardOne = await createCard(deck.body.id);
    const cardTwo = await createCard(deck.body.id);
    const cardThree = await createCard(deck.body.id);

    // Simulate already used cards in the past

    await pool.query(
      `UPDATE card
       SET difficulty = 6, win_streak = 1, next_occurrence = 0, max_early = 6
       WHERE id = $1`,
      [cardTwo.body.id]
    );

    await pool.query(
      `UPDATE card
       SET difficulty = 12, win_streak = 0, next_occurrence = 0, max_early = 15
       WHERE id = $1`,
      [cardThree.body.id]
    );

    // Simulate a session
    const response = await request(app)
      .patch("/api/users/me/cards")
      .set("Cookie", UserCookie)
      .send([
        {
          id: cardOne.body.id,
          user_answer: "easy"
        },
        {
          id: cardTwo.body.id,
          user_answer: "medium"
        },
        {
          id: cardThree.body.id,
          user_answer: "hard"
        }
      ])
      .expect(200);

    expect(response.body.cards[0].id).toEqual(cardOne.body.id);
    expect(response.body.cards[0].win_streak).toEqual(1);
    expect(response.body.cards[0].difficulty).toEqual(1);
    expect(response.body.cards[0].next_occurrence).toEqual(1);
    expect(response.body.cards[0].max_early).toEqual(4);

    expect(response.body.cards[1].id).toEqual(cardTwo.body.id);
    expect(response.body.cards[1].win_streak).toEqual(0);
    expect(response.body.cards[1].difficulty).toEqual(3);
    expect(response.body.cards[1].next_occurrence).toEqual(3);
    expect(response.body.cards[1].max_early).toEqual(6);

    expect(response.body.cards[2].id).toEqual(cardThree.body.id);
    expect(response.body.cards[2].win_streak).toEqual(0);
    expect(response.body.cards[2].difficulty).toEqual(1);
    expect(response.body.cards[2].next_occurrence).toEqual(1);
    expect(response.body.cards[2].max_early).toEqual(4);
  });

  it("processes not due cards (next_occurrence > 0) based on user answers", async () => {
    const deck = await createDeck();
    const cardOne = await createCard(deck.body.id);
    const cardTwo = await createCard(deck.body.id);
    const cardThree = await createCard(deck.body.id);

    // Simulate already used cards in the past
    await pool.query(
      `UPDATE card
       SET difficulty = 8, win_streak = 2, next_occurrence = 3, max_early = 11
       WHERE id = $1`,
      [cardOne.body.id]
    );

    await pool.query(
      `UPDATE card
       SET difficulty = 6, win_streak = 1, next_occurrence = 1, max_early = 6
       WHERE id = $1`,
      [cardTwo.body.id]
    );

    await pool.query(
      `UPDATE card
       SET difficulty = 12, win_streak = 0, next_occurrence = 1, max_early = 15
       WHERE id = $1`,
      [cardThree.body.id]
    );

    // Simulate a session
    const response = await request(app)
      .patch("/api/users/me/cards")
      .set("Cookie", UserCookie)
      .send([
        {
          id: cardOne.body.id,
          user_answer: "easy"
        },
        {
          id: cardTwo.body.id,
          user_answer: "medium"
        },
        {
          id: cardThree.body.id,
          user_answer: "hard"
        }
      ])
      .expect(200);

    expect(response.body.cards[0].id).toEqual(cardOne.body.id);
    expect(response.body.cards[0].win_streak).toEqual(2);
    expect(response.body.cards[0].difficulty).toEqual(9);
    expect(response.body.cards[0].next_occurrence).toEqual(3);
    expect(response.body.cards[0].max_early).toEqual(11);

    expect(response.body.cards[1].id).toEqual(cardTwo.body.id);
    expect(response.body.cards[1].win_streak).toEqual(0);
    expect(response.body.cards[1].difficulty).toEqual(5);
    expect(response.body.cards[1].next_occurrence).toEqual(1);
    expect(response.body.cards[1].max_early).toEqual(6);

    expect(response.body.cards[2].id).toEqual(cardThree.body.id);
    expect(response.body.cards[2].win_streak).toEqual(0);
    expect(response.body.cards[2].difficulty).toEqual(1);
    expect(response.body.cards[2].next_occurrence).toEqual(1);
    expect(response.body.cards[2].max_early).toEqual(4);
  });

  it("returns a 400 error if user_answer is not provided", async () => {
    const deck = await createDeck();
    const card = await createCard(deck.body.id);

    const response = await request(app)
      .patch("/api/users/me/cards")
      .set("Cookie", UserCookie)
      .send([{ id: card.body.id }])
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Missing field 0,user_answer", field: 0 }
    ]);
  });

  it("returns a 400 error if body does not contain an array", async () => {
    const response = await request(app)
      .patch("/api/users/me/cards")
      .set("Cookie", UserCookie)
      .send()
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: '"value" must be an array' }
    ]);
  });

  it("returns a 400 error if body is empty", async () => {
    const response = await request(app)
      .patch("/api/users/me/cards")
      .set("Cookie", UserCookie)
      .send([])
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Invalid cards data provided." }
    ]);
  });

  it("returns a 400 error if card's user_answer property is empty", async () => {
    const deck = await createDeck();
    const card = await createCard(deck.body.id);
    const response = await request(app)
      .patch("/api/users/me/cards")
      .set("Cookie", UserCookie)
      .send([{ id: card.body.id, user_answer: "" }])
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: 'User answer must be one of "easy", "medium", or "hard"',
        field: 0
      },
      { message: "User answer cannot be empty", field: 0 }
    ]);
  });

  it("returns a 400 error if card's property type is not correct", async () => {
    const response = await request(app)
      .patch("/api/users/me/cards")
      .set("Cookie", UserCookie)
      .send([{ id: "not_a_number", user_answer: 1 }])
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Card ID must be a number", field: 0 },
      {
        message: 'User answer must be one of "easy", "medium", or "hard"',
        field: 0
      },
      { message: "User answer must be a string", field: 0 }
    ]);
  });

  it("returns a 403 error if card does not exist", async () => {
    const response = await request(app)
      .patch("/api/users/me/cards")
      .set("Cookie", UserCookie)
      .send([{ id: 9999, user_answer: "easy" }]) // Non-existent card ID
      .expect(403);

    expect(response.body.errors).toEqual([
      { message: "One or more cards do not belong to you, or does not exist." }
    ]);
  });

  it("returns a 403 error if card does not belong to user", async () => {
    const user = await createUser();
    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const deck = await createDeck(); // Create a deck for the user (UserCookie)
    const card = await createCard(deck.body.id); // Create a card for the user (UserCookie)

    const response = await request(app)
      .patch("/api/users/me/cards")
      .set("Cookie", cookie)
      .send([{ id: card.body.id, user_answer: "easy" }]) // Another user's card
      .expect(403);

    expect(response.body.errors).toEqual([
      { message: "One or more cards do not belong to you, or does not exist." }
    ]);
  });
});
