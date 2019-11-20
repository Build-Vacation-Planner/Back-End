const request = require("supertest");
const bcrypt = require("bcryptjs");
const cleaner = require("knex-cleaner");
const generateToken = require("../../auth/generate-token");

const server = require("../../api/server");
const db = require("../../data/dbConfig");

beforeEach(async () => {
  await cleaner.clean(db);
  await db("users").insert({
    username: "Test2",
    password: bcrypt.hashSync("Test2", 12)
  });
  await db("vacations").insert({ name: "Summer Vacations", owner_id: 1 });
});

describe("Activities", () => {
  describe("POST /api/vacations/:vid/activities", () => {
    it("should return status 201 on successful request", async () => {
      const user = await db("users")
        .where({ id: 1 })
        .first();

      const token = generateToken(user);

      const res = await request(server)
        .post("/api/vacations/1/activities")
        .send({ name: "Skiing" })
        .set("authorization", token);

      expect(res.status).toBe(201);
    });
  });
  describe("PUT /api/vacations/:vid/activities/:id", () => {
    it("should return status 202 on successful request", async () => {
      const user = await db("users")
        .where({ id: 1 })
        .first();

      const token = generateToken(user);

      await db("activities").insert({ name: "sky diving" });
      const res = await request(server)
        .put("/api/vacations/1/activities/1")
        .send({ name: "golf" })
        .set("authorization", token);

      expect(res.status).toBe(202);
    });
  });

  describe("DELETE /api/vacations/:vid/activities/:id", () => {
    it("should return status 202 on successful request", async () => {
      const user = await db("users")
        .where({ id: 1 })
        .first();

      const token = generateToken(user);

      await db("activities").insert({ name: "sky diving" });
      const res = await request(server)
        .delete("/api/vacations/1/activities/1")
        .set("authorization", token);

      expect(res.status).toBe(202);
    });
  });
});
