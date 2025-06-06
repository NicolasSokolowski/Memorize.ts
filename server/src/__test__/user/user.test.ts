import { pool } from "../../database/pg.client";
import request from "supertest";
import { app } from "../../index.app";
import { UserCookie } from "../helpers/test.helpers";

describe("User tests", () => {
  afterEach(async () => {
    await pool.query(`DELETE FROM "user" WHERE email = 'user@user.com'`);
  });

  // ---------- POST /api/users ----------

  it("creates a user when providing valid data", async () => {
    await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: "user@user.com",
        password: "pAssw0rd!123",
        username: "test_user",
      })
      .expect(201);
  });

  it("returns a 400 error when providing an already existing email", async () => {
    await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: "user@user.com",
        password: "pAssw0rd!123",
        username: "test_user",
      })
      .expect(201);

    await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: "user@user.com",
        password: "pAssw0rd!123",
        username: "test_user",
      })
      .expect(400);
  });

  it("returns a 400 error when providing a password with no uppercase", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: "user@user.com",
        password: "passw0rd!123", // No uppercase letter
        username: "test_user",
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message:
          '"password" must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
      },
    ]);
  });

  it("returns a 400 error when providing a password with no lowercase", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: "user@user.com",
        password: "PASSW0RD!123", // No lowercase letter
        username: "test_user",
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message:
          '"password" must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
      },
    ]);
  });

  it("returns a 400 error when providing a password with no digit", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: "user@user.com",
        password: "pAssword!abc", // No digit
        username: "test_user",
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message:
          '"password" must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
      },
    ]);
  });

  it("returns a 400 error when providing a password with no special character", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: "user@user.com",
        password: "pAsswordaabc", // No special character
        username: "test_user",
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message:
          '"password" must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
      },
    ]);
  });

  it("returns a 400 error when providing a password with less than 12 characters", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: "user@user.com",
        password: "pAssword!", // Less than 12 characters
        username: "test_user",
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Password must be at least 12 characters long",
      },
      {
        message:
          '"password" must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
      },
    ]);
  });

  it("returns a 400 error when providing an empty password", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: "user@user.com",
        password: "", // Empty password
        username: "test_user",
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Password cannot be empty" },
    ]);
  });

  it("returns a 400 error when providing a wrong type password", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: "user@user.com",
        password: 123, // Wrong type
        username: "test_user",
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Password must be a string" },
    ]);
  });

  it("returns a 400 error when not providing a password", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: "user@user.com",
        // No password provided
        username: "test_user",
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Missing field password" },
    ]);
  });

  it("returns a 400 error when providing an invalid email", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: "useruser.com", // Invalid email format
        password: "pAssw0rd!123",
        username: "test_user",
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Email must be a valid email address" },
    ]);
  });

  it("returns a 400 error when providing a wrong type email", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: 123, // Wrong type
        password: "pAssw0rd!123",
        username: "test_user",
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Email must be a string" },
    ]);
  });

  it("returns a 400 error when providing an empty email", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: "", // Empty email
        password: "pAssw0rd!123",
        username: "test_user",
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Email cannot be empty" },
    ]);
  });

  it("returns a 400 error when not providing an email", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        // No email provided
        password: "pAssw0rd!123",
        username: "test_user",
      })
      .expect(400);

    expect(response.body.errors).toEqual([{ message: "Missing field email" }]);
  });

  it("returns a 400 error when providing an username with more than 20 characters", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: "user@user.com",
        password: "pAssw0rd!123",
        username: "test_user_with_a_very_long_username_that_exceeds_the_limit", // More than 20 characters
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Username must be at most 20 characters long" },
    ]);
  });

  it("returns a 400 error when providing an username with less than 3 characters", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: "user@user.com",
        password: "pAssw0rd!123",
        username: "te", // Less than 3 characters
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Username must be at least 3 characters long" },
    ]);
  });

  it("returns a 400 error when providing an empty username", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: "user@user.com",
        password: "pAssw0rd!123",
        username: "", // Empty username
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Username cannot be empty" },
    ]);
  });

  it("returns a 400 error when not providing a username", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Cookie", UserCookie)
      .send({
        email: "user@user.com",
        password: "pAssw0rd!123",
        // No username provided
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Missing field username" },
    ]);
  });
});
