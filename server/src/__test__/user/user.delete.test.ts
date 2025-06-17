import { poolConfig } from "../../database/pg.client";
import { Pool } from "pg";
import request from "supertest";
import { app } from "../../index.app";
import {
  createUser,
  mockAdminAccessToken,
  mockAdminCookie,
  mockCookie,
  mockUserAccessToken,
  UserCookie
} from "../helpers/test.helpers";

const pool = new Pool(poolConfig);

describe("User GET tests", () => {
  beforeAll(async () => {
    await pool.query(
      `INSERT INTO "user" ("email", "password", "username", "role_id") VALUES ('user@user.com', 'pAssw0rd!123', 'test_user', 2) ON CONFLICT DO NOTHING`
    );
    await pool.query(
      `INSERT INTO "user" ("email", "password", "username", "role_id") VALUES ('admin@admin.com', 'pAssw0rd!123', 'test_admin', 1) ON CONFLICT DO NOTHING`
    );
  });

  afterAll(async () => {
    await pool.query(`TRUNCATE TABLE "user" RESTART IDENTITY CASCADE`);
    await pool.end();
  });

  // ---------- DELETE /api/profile ----------

  it("deletes the user profile when providing correct data", async () => {
    const response = await request(app)
      .delete("/api/profile")
      .set("Cookie", UserCookie)
      .expect(200);

    expect(response.body.message).toBe("Account deleted successfully");

    const userCheck = await pool.query(
      `SELECT * FROM "user" WHERE email = 'user@user.com'`
    );

    expect(userCheck.rows.length).toBe(0);
  });

  it("returns a 401 error when trying to delete the profile without an access token", async () => {
    const response = await request(app).delete("/api/profile").expect(401);

    expect(response.body.errors).toEqual([{ message: "Not authorized" }]);
  });

  it("returns a 404 error when trying to delete an already deleted profile", async () => {
    const user = await createUser();
    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    // First delete the profile
    await request(app).delete("/api/profile").set("Cookie", cookie).expect(200);

    // Then try to delete it again
    const response = await request(app)
      .delete("/api/profile")
      .set("Cookie", cookie)
      .expect(404);

    expect(response.body.errors).toEqual([{ message: "Not Found" }]);
  });

  it("deletes all the decks and cards associated with the user", async () => {
    const user = await createUser();
    const accessToken = mockUserAccessToken(user.body.user.email);
    const cookie = mockCookie(accessToken);

    // Create a deck and a card for the user
    const deck = await request(app)
      .post("/api/decks")
      .set("Cookie", cookie)
      .send({ name: "test_deck" })
      .expect(201);

    const card = await request(app)
      .post(`/api/decks/${deck.body.id}/cards`)
      .set("Cookie", cookie)
      .send({ front: "test_front", back: "test_back" })
      .expect(201);

    // Delete the user profile

    await request(app).delete("/api/profile").set("Cookie", cookie).expect(200);

    // Check if the deck and card are deleted

    const deckCheck = await pool.query(`SELECT * FROM "deck" WHERE id = $1`, [
      deck.body.id
    ]);

    const cardCheck = await pool.query(`SELECT * FROM "card" WHERE id = $1`, [
      card.body.id
    ]);

    expect(deckCheck.rows.length).toBe(0);
    expect(cardCheck.rows.length).toBe(0);
  });

  // ---------- DELETE /api/users/:user_id ----------

  it("deletes a user by ID when providing correct data", async () => {
    const user = await createUser();
    const accessToken = mockAdminAccessToken(user.body.user.email);
    const cookie = mockAdminCookie(accessToken);

    const userToDelete = await createUser();

    const response = await request(app)
      .delete(`/api/users/${userToDelete.body.user.id}`)
      .set("Cookie", cookie)
      .expect(200);

    expect(response.body.message).toBe("Item successfully deleted.");

    const userCheck = await pool.query(`SELECT * FROM "user" WHERE id = $1`, [
      userToDelete.body.user.id
    ]);

    expect(userCheck.rows.length).toBe(0);
  });

  it("returns a 403 error when trying to delete a user as a regular user", async () => {
    const user = await createUser();

    const response = await request(app)
      .delete(`/api/users/${user.body.user.id}`)
      .set("Cookie", UserCookie)
      .expect(403);

    expect(response.body.errors).toEqual([
      { message: "Not enough permissions" }
    ]);
  });

  it("returns a 404 error when trying to delete a non-existing user", async () => {
    const user = await createUser();
    const accessToken = mockAdminAccessToken(user.body.user.email);
    const cookie = mockAdminCookie(accessToken);

    const response = await request(app)
      .delete("/api/users/9999") // Assuming this ID does not exist
      .set("Cookie", cookie)
      .expect(404);

    expect(response.body.errors).toEqual([{ message: "Not Found" }]);
  });

  it("returns a 400 error when trying to delete a user with an invalid ID", async () => {
    const user = await createUser();
    const accessToken = mockAdminAccessToken(user.body.user.email);
    const cookie = mockAdminCookie(accessToken);

    const response = await request(app)
      .delete("/api/users/invalid_id")
      .set("Cookie", cookie)
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Please provide a valid id." }
    ]);
  });

  it("returns a 401 error when trying to delete a user without an access token", async () => {
    const response = await request(app)
      .delete("/api/users/1") // Assuming user with ID 1 exists
      .expect(401);

    expect(response.body.errors).toEqual([{ message: "Not authorized" }]);
  });
});
