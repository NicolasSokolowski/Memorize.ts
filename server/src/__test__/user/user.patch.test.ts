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
import { Password } from "../../helpers/Password";

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
        message: "Provided email is already used",
        code: "EMAIL_ALREADY_EXISTS",
        field: "email"
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
        message: "email must be a valid email address",
        field: "email",
        code: "VALIDATION_ERROR",
        type: "string.email",
        context: {
          key: "email",
          label: "email",
          value: "useruser.com",
          invalids: ["useruser.com"]
        }
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
        message: "email must be a string",
        field: "email",
        code: "VALIDATION_ERROR",
        type: "string.base",
        context: {
          key: "email",
          label: "email",
          value: 1
        }
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
        message: "email cannot be empty",
        field: "email",
        code: "VALIDATION_ERROR",
        type: "string.empty",
        context: {
          key: "email",
          label: "email",
          value: ""
        }
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
        message: "At least one field (email or username) must be provided",
        code: "VALIDATION_ERROR",
        type: "object.min",
        context: {
          label: "value",
          limit: 1,
          value: {}
        }
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
        message: "username must be a string",
        field: "username",
        code: "VALIDATION_ERROR",
        type: "string.base",
        context: {
          key: "username",
          label: "username",
          value: 123
        }
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
        message: "username cannot be empty",
        field: "username",
        code: "VALIDATION_ERROR",
        type: "string.empty",
        context: {
          key: "username",
          label: "username",
          value: ""
        }
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
        message: "username must be at most 20 characters long",
        field: "username",
        code: "VALIDATION_ERROR",
        type: "string.max",
        context: {
          key: "username",
          label: "username",
          limit: 20,
          value: "this_is_a_very_long_username_that_exceeds_twenty_characters"
        }
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
        message: "username must be at least 3 characters long",
        field: "username",
        code: "VALIDATION_ERROR",
        type: "string.min",
        context: {
          key: "username",
          label: "username",
          limit: 3,
          value: "ab"
        }
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
        message: "confirmNewPassword must match new password",
        field: "confirmNewPassword",
        code: "VALIDATION_ERROR",
        type: "any.only",
        context: {
          key: "confirmNewPassword",
          label: "confirmNewPassword",
          valids: [
            {
              adjust: null,
              ancestor: 1,
              depth: 1,
              display: "ref:newPassword",
              in: false,
              iterables: null,
              key: "newPassword",
              map: null,
              path: ["newPassword"],
              root: "newPassword",
              separator: ".",
              type: "value"
            }
          ],
          value: "newP@ssw0rd!45"
        }
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
        message: '"confirmNewPassword" is required',
        field: "confirmNewPassword",
        code: "VALIDATION_ERROR",
        type: "any.required",
        context: {
          key: "confirmNewPassword",
          label: "confirmNewPassword"
        }
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
        message: "currentPassword must be a string",
        field: "currentPassword",
        code: "VALIDATION_ERROR",
        type: "string.base",
        context: {
          key: "currentPassword",
          label: "currentPassword",
          value: 1
        }
      },
      {
        message: "newPassword must be a string",
        field: "newPassword",
        code: "VALIDATION_ERROR",
        type: "string.base",
        context: {
          key: "newPassword",
          label: "newPassword",
          value: 1
        }
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
        message: "currentPassword cannot be empty",
        field: "currentPassword",
        code: "VALIDATION_ERROR",
        type: "string.empty",
        context: {
          key: "currentPassword",
          label: "currentPassword",
          value: ""
        }
      },
      {
        message: "newPassword cannot be empty",
        field: "newPassword",
        code: "VALIDATION_ERROR",
        type: "string.empty",
        context: {
          key: "newPassword",
          label: "newPassword",
          value: ""
        }
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
        message: '"currentPassword" is required',
        field: "currentPassword",
        code: "VALIDATION_ERROR",
        type: "any.required",
        context: {
          key: "currentPassword",
          label: "currentPassword"
        }
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
        message: "Not enough permissions",
        code: "ACCESS_DENIED"
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
        message: "Role not found",
        code: "ROLE_NOT_FOUND"
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
        message: "Name must be a string",
        field: "name",
        code: "VALIDATION_ERROR",
        type: "string.base",
        context: {
          key: "name",
          label: "name",
          value: 1
        }
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
        message: "Name cannot be empty",
        field: "name",
        code: "VALIDATION_ERROR",
        type: "string.empty",
        context: {
          key: "name",
          label: "name",
          value: ""
        }
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
        message: "You should provide a valid id",
        code: "INVALID_PARAMETER"
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
        message: '"name" is required',
        field: "name",
        code: "VALIDATION_ERROR",
        type: "any.required",
        context: {
          key: "name",
          label: "name"
        }
      }
    ]);
  });
});
