import { poolConfig } from "../../database/pg.client";
import request from "supertest";
import { app } from "../../index.app";
import { Pool } from "pg";
import { Password } from "../../helpers/Password";
import { createCard, createDeck, UserCookie } from "../helpers/test.helpers";

const pool = new Pool(poolConfig);

describe("User tests", () => {
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
    await pool.query(`DELETE FROM "user" WHERE email = 'testuser@user.com'`);
  });

  afterAll(async () => {
    await pool.query(`TRUNCATE TABLE "user" RESTART IDENTITY CASCADE`);
    await pool.end();
  });

  // ---------- POST /api/users ----------

  it("creates a user when providing valid data", async () => {
    await request(app)
      .post("/api/users")
      .send({
        email: "testuser@user.com",
        password: "pAssw0rd!123",
        username: "test_user"
      })
      .expect(201);
  });

  it("returns a 400 error when providing an already existing email", async () => {
    await request(app)
      .post("/api/users")
      .send({
        email: "testuser@user.com",
        password: "pAssw0rd!123",
        username: "test_user"
      })
      .expect(201);

    await request(app)
      .post("/api/users")
      .send({
        email: "testuser@user.com",
        password: "pAssw0rd!123",
        username: "test_user"
      })
      .expect(400);
  });

  it("returns a 400 error when providing a password with no uppercase", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        email: "testuser@user.com",
        password: "passw0rd!123", // No uppercase letter
        username: "test_user"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message:
          '"password" must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        field: "password"
      }
    ]);
  });

  it("returns a 400 error when providing a password with no lowercase", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        email: "testuser@user.com",
        password: "PASSW0RD!123", // No lowercase letter
        username: "test_user"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message:
          '"password" must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        field: "password"
      }
    ]);
  });

  it("returns a 400 error when providing a password with no digit", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        email: "testuser@user.com",
        password: "pAssword!abc", // No digit
        username: "test_user"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message:
          '"password" must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        field: "password"
      }
    ]);
  });

  it("returns a 400 error when providing a password with no special character", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        email: "testuser@user.com",
        password: "pAsswordaabc", // No special character
        username: "test_user"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message:
          '"password" must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        field: "password"
      }
    ]);
  });

  it("returns a 400 error when providing a password with less than 12 characters", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        email: "testuser@user.com",
        password: "pAssword!", // Less than 12 characters
        username: "test_user"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Password must be at least 12 characters long",
        field: "password"
      },
      {
        message:
          '"password" must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        field: "password"
      }
    ]);
  });

  it("returns a 400 error when providing an empty password", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        email: "testuser@user.com",
        password: "", // Empty password
        username: "test_user"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Password cannot be empty", field: "password" }
    ]);
  });

  it("returns a 400 error when providing a wrong type password", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        email: "testuser@user.com",
        password: 123, // Wrong type
        username: "test_user"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Password must be a string", field: "password" }
    ]);
  });

  it("returns a 400 error when not providing a password", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        email: "testuser@user.com",
        // No password provided
        username: "test_user"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Missing field password", field: "password" }
    ]);
  });

  it("returns a 400 error when providing an invalid email", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        email: "useruser.com", // Invalid email format
        password: "pAssw0rd!123",
        username: "test_user"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Email must be a valid email address", field: "email" }
    ]);
  });

  it("returns a 400 error when providing a wrong type email", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        email: 123, // Wrong type
        password: "pAssw0rd!123",
        username: "test_user"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Email must be a string", field: "email" }
    ]);
  });

  it("returns a 400 error when providing an empty email", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        email: "", // Empty email
        password: "pAssw0rd!123",
        username: "test_user"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Email cannot be empty", field: "email" }
    ]);
  });

  it("returns a 400 error when not providing an email", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        // No email provided
        password: "pAssw0rd!123",
        username: "test_user"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Missing field email", field: "email" }
    ]);
  });

  it("returns a 400 error when providing an username with more than 20 characters", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        email: "testuser@user.com",
        password: "pAssw0rd!123",
        username: "test_user_with_a_very_long_username_that_exceeds_the_limit" // More than 20 characters
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Username must be at most 20 characters long",
        field: "username"
      }
    ]);
  });

  it("returns a 400 error when providing an username with less than 3 characters", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        email: "testuser@user.com",
        password: "pAssw0rd!123",
        username: "te" // Less than 3 characters
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Username must be at least 3 characters long",
        field: "username"
      }
    ]);
  });

  it("returns a 400 error when providing an empty username", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        email: "testuser@user.com",
        password: "pAssw0rd!123",
        username: "" // Empty username
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Username cannot be empty", field: "username" }
    ]);
  });

  it("returns a 400 error when not providing a username", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        email: "testuser@user.com",
        password: "pAssw0rd!123"
        // No username provided
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Missing field username", field: "username" }
    ]);
  });

  // ---------- POST /api/profile ----------

  it("logs in a user with valid credentials", async () => {
    const response = await request(app)
      .post("/api/profile")
      .send({
        email: "user@user.com",
        password: "pAssw0rd!123"
      })
      .expect(200);

    const today = new Date();
    const lastLogin = new Date(response.body.user.last_login);

    expect(lastLogin.getFullYear()).toBe(today.getFullYear());
    expect(lastLogin.getMonth()).toBe(today.getMonth());
    expect(lastLogin.getDate()).toBe(today.getDate());
  });

  it("returns a 400 error when providing an invalid email", async () => {
    const response = await request(app)
      .post("/api/profile")
      .send({
        email: "useruser.com", // Invalid email format
        password: "pAssw0rd!123"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Email must be a valid email address", field: "email" }
    ]);
  });

  it("returns a 400 error when providing a wrong type email", async () => {
    const response = await request(app)
      .post("/api/profile")
      .send({
        email: 123, // Wrong type
        password: "pAssw0rd!123"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Email must be a string", field: "email" }
    ]);
  });

  it("returns a 400 error when providing empty properties", async () => {
    const response = await request(app)
      .post("/api/profile")
      .send({
        email: "", // Empty email
        password: ""
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Email cannot be empty", field: "email" },
      { message: "Password cannot be empty", field: "password" }
    ]);
  });

  it("returns a 400 error when not providing properties", async () => {
    const response = await request(app)
      .post("/api/profile")
      .send() // No properties provided
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Missing field email", field: "email" },
      { message: "Missing field password", field: "password" }
    ]);
  });

  it("returns a 400 error when providing a wrong type password", async () => {
    const response = await request(app)
      .post("/api/profile")
      .send({
        email: "user@user.com",
        password: 123 // Wrong type
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Password must be a string", field: "password" }
    ]);
  });

  it("updates user's cards when logging in", async () => {
    const deck = await createDeck();
    const cardOne = await createCard(deck.body.id);
    const cardTwo = await createCard(deck.body.id);

    const user = await request(app)
      .get("/api/profile")
      .set("Cookie", UserCookie)
      .expect(200);

    // Simulate a user who hasn't logged in for a day
    await pool.query(
      `UPDATE "user" SET "last_login" = NOW() - INTERVAL '1 day' WHERE "id" = $1`,
      [user.body.user.id]
    );

    // Set initial next_occurrence for the cards
    await pool.query(
      `UPDATE "card" SET "next_occurrence" = 16, "difficulty" = 3 WHERE "id" = $1`,
      [cardOne.body.id]
    );

    await pool.query(
      `UPDATE "card" SET "next_occurrence" = 1, "difficulty" = 24 WHERE "id" = $1`,
      [cardTwo.body.id]
    );

    // Log in to trigger the card update
    await request(app)
      .post("/api/profile")
      .send({
        email: "user@user.com",
        password: "pAssw0rd!123"
      })
      .expect(200);

    const responseOne = await request(app)
      .get(`/api/decks/${deck.body.id}/cards/${cardOne.body.id}`)
      .set("Cookie", UserCookie)
      .expect(200);

    const responseTwo = await request(app)
      .get(`/api/decks/${deck.body.id}/cards/${cardTwo.body.id}`)
      .set("Cookie", UserCookie)
      .expect(200);

    expect(responseOne.body.difficulty).toBe(3);
    expect(responseTwo.body.difficulty).toBe(24);

    expect(responseOne.body.win_streak).toBe(0);
    expect(responseTwo.body.win_streak).toBe(0);

    expect(responseOne.body.next_occurrence).toBe(15);
    expect(responseTwo.body.next_occurrence).toBe(0);

    expect(responseOne.body.max_early).toBe(0);
    expect(responseTwo.body.max_early).toBe(27);
  });
});
