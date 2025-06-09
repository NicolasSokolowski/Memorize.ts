import { poolConfig } from "../../database/pg.client";
import request from "supertest";
import { app } from "../../index.app";
import { Pool } from "pg";
import {
  createUser,
  mockUserAccessToken,
  mockCookie
} from "../helpers/test.helpers";

const pool = new Pool(poolConfig);

describe("User tests", () => {
  afterEach(async () => {
    await pool.query(
      `DELETE FROM "user" WHERE email IN ('user@user.com', 'admin@admin.com', 'newemail@user.com');`
    );
  });

  afterAll(async () => {
    await pool.query(
      `DELETE FROM "user" WHERE email IN ('user@user.com', 'admin@admin.com');`
    );
    await pool.end();
  });

  // ---------- PATCH /api/profile ----------

  it("updates user profile when providing valid data", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .patch("/api/profile")
      .set("Cookie", cookie)
      .send({
        email: "newemail@user.com",
        username: "new_username"
      })
      .expect(200);

    expect(response.body.email).toBe("newemail@user.com");
    expect(response.body.username).toBe("new_username");
  });

  it("returns a 400 error when trying to update an user with an already existing email", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .patch("/api/profile")
      .set("Cookie", cookie)
      .send({
        email: "user@user.com"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Provided email is already in use. Please choose another one."
      }
    ]);
  });

  it("returns a 400 error when trying to update an user with an invalid format email", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .patch("/api/profile")
      .set("Cookie", cookie)
      .send({
        email: "useruser.com" // Invalid email format
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Email must be a valid email address"
      }
    ]);
  });

  it("returns a 400 error when trying to update an user with an invalid type email", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .patch("/api/profile")
      .set("Cookie", cookie)
      .send({
        email: 1 // Invalid email type
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Email must be a string"
      }
    ]);
  });

  it("returns a 400 error when trying to update an user with an empty email", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .patch("/api/profile")
      .set("Cookie", cookie)
      .send({
        email: "" // Empty email
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Email cannot be empty"
      }
    ]);
  });

  it("returns a 400 error when trying to update an user with an empty object", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .patch("/api/profile")
      .set("Cookie", cookie)
      .send() // Empty object
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "At least one field (email or username) must be provided"
      }
    ]);
  });

  it("returns a 400 error when trying to update an user with an invalid username type", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .patch("/api/profile")
      .set("Cookie", cookie)
      .send({
        email: "user@user.com",
        username: 123 // Invalid username type
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Username must be a string"
      }
    ]);
  });

  it("returns a 400 error when trying to update an user with an empty username", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .patch("/api/profile")
      .set("Cookie", cookie)
      .send({
        username: "" // Empty username
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Username cannot be empty"
      }
    ]);
  });

  it("returns a 400 error when trying to update an user with a username with more than 20 characters", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .patch("/api/profile")
      .set("Cookie", cookie)
      .send({
        username: "this_is_a_very_long_username_that_exceeds_twenty_characters" // More than 20 characters
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Username must be at most 20 characters long"
      }
    ]);
  });

  it("returns a 400 error when trying to update an user with a username with less than 3 characters", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .patch("/api/profile")
      .set("Cookie", cookie)
      .send({
        username: "ab" // Less than 3 characters
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Username must be at least 3 characters long"
      }
    ]);
  });
});
