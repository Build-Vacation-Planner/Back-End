const request = require("supertest");
const bcrypt = require("bcryptjs");
const cleaner = require("knex-cleaner");
const generateToken = require("../../auth/generate-token");

const server = require("../../api/server");
const db = require("../../data/dbConfig");

beforeEach(async () => {
  await cleaner.clean(db);
  await db("users").insert({
    username: "Test1",
    password: bcrypt.hashSync("Test1", 12)
  });
  await db("vacations").insert({ name: "Summer Vacations", owner_id: 1 });
});

describe("Dates", () => {
  describe("POST /api/vacations/:vid/dates", () => {
    it("should return status 201 on successful request", async () => {
      const user = await db("users")
        .where({ id: 1 })
        .first();

      const token = generateToken(user);

      const res = await request(server)
        .post("/api/vacations/1/dates")
        .send({ start: "2020-10-01", end: "2020-10-08" })
        .set("authorization", token);

      expect(res.status).toBe(201);
    });
  });

  describe("PUT /api/vacations/:vid/dates/:id", () => {
    it("should return status 202 on successful request", async () => {
      const user = await db("users")
        .where({ id: 1 })
        .first();

      const token = generateToken(user);

      await db("dates").insert({ start: "2020-10-01", end: "2020-10-08" });
      const res = await request(server)
        .put("/api/vacations/1/dates/1")
        .send({ start: "2020-10-15", end: "2020-10-23" })
        .set("authorization", token);

      expect(res.status).toBe(202);
    });
  });

  describe("DELETE /api/vacations/:vid/dates/:id", () => {
    it("should return status 202 on successful request", async () => {
      const user = await db("users")
        .where({ id: 1 })
        .first();

      const token = generateToken(user);

      await db("dates").insert({ start: "2020-10-01", end: "2020-10-08" });
      const res = await request(server)
        .delete("/api/vacations/1/dates/1")
        .set("authorization", token);

      expect(res.status).toBe(202);
    });
  });
});
