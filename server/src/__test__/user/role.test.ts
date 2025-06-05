import { pool } from "../../database/pg.client";
import request from "supertest";
import { app } from "../../index.app";
import { UserCookie } from "../helpers/test.helpers";

describe("Role tests", () => {
  afterEach(async () => {
    await pool.query(`DELETE FROM "role" WHERE name = 'test_role'`);
  });

  // ---------- POST /api/users/role ----------

  it("creates a role when providing correct data", async () => {
    await request(app)
      .post("/api/users/role")
      .set("Cookie", UserCookie)
      .send({
        name: "test_role",
      })
      .expect(201);
  });

  it("returns a 400 error when providing wrong data type", async () => {
    const response = await request(app)
      .post("/api/users/role")
      .set("Cookie", UserCookie)
      .send({
        name: 1, // Wrong data type
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Name must be a string" },
    ]);
  });

  it("returns a 400 error when name field is not provided", async () => {
    const response = await request(app)
      .post("/api/users/role")
      .set("Cookie", UserCookie)
      .send()
      .expect(400);

    expect(response.body.errors).toEqual([{ message: "Missing field name" }]);
  });

  it("returns a 400 error when name field is empty", async () => {
    const response = await request(app)
      .post("/api/users/role")
      .set("Cookie", UserCookie)
      .send({
        name: "", // Empty name
      })
      .expect(400);

    expect(response.body.errors).toEqual([{ message: "Name cannot be empty" }]);
  });

  it("returns a 400 error when name is less then 3 characters", async () => {
    const response = await request(app)
      .post("/api/users/role")
      .set("Cookie", UserCookie)
      .send({
        name: "ch", // Less than 3 characters
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Name must be at least 3 characters long" },
    ]);
  });

  it("returns a 400 error when name is more than 15 characters", async () => {
    const response = await request(app)
      .post("/api/users/role")
      .set("Cookie", UserCookie)
      .send({
        name: "super_long_admin_role_name_for_no_test_purposes", // Less than 3 characters
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Name must be at most 15 characters long" },
    ]);
  });

  it("returns an error when provided  role name already exists", async () => {
    const response = await request(app)
      .post("/api/users/role")
      .set("Cookie", UserCookie)
      .send({
        name: "user", // Existing role name
      })
      .expect(400);

    expect(response.body.errors).toEqual([
      { message: "Provided item already exists." },
    ]);
  });

  // ---------- GET /api/users/role ----------
});
