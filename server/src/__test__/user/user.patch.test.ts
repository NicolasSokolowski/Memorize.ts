import { poolConfig } from "../../database/pg.client";
import request from "supertest";
import { app } from "../../index.app";
import { Pool } from "pg";
import {
  createUser,
  mockUserAccessToken,
  mockCookie,
  UserCookie,
  AdminCookie
} from "../helpers/test.helpers";

const pool = new Pool(poolConfig);

describe("User tests", () => {
  beforeAll(async () => {
    await pool.query(
      `INSERT INTO "user" ("email", "password", "username", "role_id") VALUES ('user@user.com', 'pAssw0rd!123', 'test_user', 2) ON CONFLICT DO NOTHING`
    );
    await pool.query(
      `INSERT INTO "user" ("email", "password", "username", "role_id") VALUES ('admin@admin.com', 'pAssw0rd!123', 'test_admin', 1) ON CONFLICT DO NOTHING`
    );
  });

  afterEach(async () => {
    await pool.query(
      `DELETE FROM "user" WHERE email IN ('newemail@user.com', 'testuser@user.com');`
    );
  });

  afterAll(async () => {
    await pool.query(`TRUNCATE TABLE "user" RESTART IDENTITY CASCADE`);
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

    expect(response.body.user.email).toBe("newemail@user.com");
    expect(response.body.user.username).toBe("new_username");
  });

  it("returns a 400 error when trying to update an user with an already existing email", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .patch("/api/profile")
      .set("Cookie", cookie)
      .send({
        email: user.body.user.email
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

  // ---------- PATCH /api/profile/changepw ----------

  it("updates user password when providing valid data", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    await request(app)
      .patch("/api/profile/changepw")
      .set("Cookie", cookie)
      .send({
        currentPassword: "pAssw0rd!123",
        newPassword: "newP@ssw0rd!456",
        confirmNewPassword: "newP@ssw0rd!456"
      })
      .expect(200);
  });

  it("returns a 400 error when trying to update user password but current password does not match the one stored in the database", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .patch("/api/profile/changepw")
      .set("Cookie", cookie)
      .send({
        currentPassword: "pAssw0rdd!123", // Incorrect current password
        newPassword: "newP@ssw0rd!456",
        confirmNewPassword: "newP@ssw0rd!456"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Current password is incorrect"
      }
    ]);
  });

  it("returns a 400 error when trying to update user password but new password does not match confirm password", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .patch("/api/profile/changepw")
      .set("Cookie", cookie)
      .send({
        currentPassword: "pAssw0rd!123",
        newPassword: "newP@ssw0rd!456",
        confirmNewPassword: "newP@ssw0rd!45" // Mismatch
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Confirm password must match new password"
      }
    ]);
  });

  it("returns a 400 error when trying to update user password but confirm password is missing", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .patch("/api/profile/changepw")
      .set("Cookie", cookie)
      .send({
        currentPassword: "pAssw0rd!123",
        newPassword: "newP@ssw0rd!456"
        // confirmNewPassword is missing
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Missing field confirmNewPassword"
      }
    ]);
  });

  it("returns a 400 error when trying to update user password but providing wrong data type", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .patch("/api/profile/changepw")
      .set("Cookie", cookie)
      .send({
        currentPassword: 1,
        newPassword: 1,
        confirmNewPassword: 1
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "currentPassword must be a string"
      },
      {
        message: "newPassword must be a string"
      }
    ]);
  });

  it("returns a 400 error when trying to update password with empty fields", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .patch("/api/profile/changepw")
      .set("Cookie", cookie)
      .send({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "" // Empty fields
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "currentPassword cannot be empty"
      },
      {
        message: "newPassword cannot be empty"
      }
    ]);
  });

  it("returns a 400 error when trying to update password with missing current password", async () => {
    const user = await createUser();

    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    const response = await request(app)
      .patch("/api/profile/changepw")
      .set("Cookie", cookie)
      .send({
        // currentPassword is missing
        newPassword: "pAssw0rd!123",
        confirmNewPassword: "pAssw0rd!123"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Missing field currentPassword"
      }
    ]);
  });

  // ---------- PATCH /api/users/:user_id ----------

  it("updates a user's role when providing correct data", async () => {
    const user = await createUser();

    const response = await request(app)
      .patch(`/api/users/${user.body.user.id}`)
      .set("Cookie", AdminCookie)
      .send({
        name: "admin"
      })
      .expect(200);

    expect(response.body.user.role_id).toBe(1);
  });

  it("returns a 403 error when trying to update a user's role as a user", async () => {
    const user = await createUser();

    const response = await request(app)
      .patch(`/api/users/${user.body.user.id}`)
      .set("Cookie", UserCookie)
      .send({
        name: "admin"
      })
      .expect(403);

    expect(response.body.errors).toEqual([
      {
        message: "Not enough permissions"
      }
    ]);
  });

  it("returns a 404 error when trying to update a user's role that does not exist", async () => {
    const user = await createUser();

    const response = await request(app)
      .patch(`/api/users/${user.body.user.id}`)
      .set("Cookie", AdminCookie)
      .send({
        name: "general" // Non-existing role
      })
      .expect(404);

    expect(response.body.errors).toEqual([
      {
        message: "Not Found"
      }
    ]);
  });

  it("returns a 400 error when updating a user's role but providing invalid name data type", async () => {
    const user = await createUser();

    const response = await request(app)
      .patch(`/api/users/${user.body.user.id}`)
      .set("Cookie", AdminCookie)
      .send({
        name: 1 // Invalid data type
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Name must be a string"
      }
    ]);
  });

  it("returns a 400 error when updating a user's role but providing empty name", async () => {
    const user = await createUser();

    const response = await request(app)
      .patch(`/api/users/${user.body.user.id}`)
      .set("Cookie", AdminCookie)
      .send({
        name: "" // Empty name
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Name cannot be empty"
      }
    ]);
  });

  it("returns a 400 error when updating a user's role with an invalid id", async () => {
    const response = await request(app)
      .patch(`/api/users/invalid_id`) // Invalid ID
      .set("Cookie", AdminCookie)
      .send({
        name: "admin"
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "You should provide a valid id"
      }
    ]);
  });

  it("returns a 400 error when updating a user's role with missing name field", async () => {
    const response = await request(app)
      .patch(`/api/users/invalid_id`)
      .set("Cookie", AdminCookie)
      .send() // No name field provided
      .expect(400);

    expect(response.body.errors).toEqual([
      {
        message: "Missing field name"
      }
    ]);
  });
});
