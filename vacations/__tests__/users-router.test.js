const request = require("supertest");
const bcrypt = require("bcryptjs");
const cleaner = require("knex-cleaner");
const generateToken = require("../../auth/generate-token");

const server = require("../../api/server");
const db = require("../../data/dbConfig");
const dbUservacations = require("../users/user-vacations-model");

beforeEach(async () => {
  await cleaner.clean(db);
  await db("users").insert({
    username: "User",
    password: bcrypt.hashSync("Test1", 12)
  });
  await db("users").insert({
    username: "User2",
    password: bcrypt.hashSync("Test1", 12)
  });
  await db("vacations").insert({ name: "Summer Vacations", owner_id: 1 });
});

describe("Users", () => {
  describe("POST /api/vacations/:vid/users", () => {
    it("should return status 201 on successful request", async () => {
      const user = await db("users")
        .where({ id: 1 })
        .first();

      const token = generateToken(user);

      const res = await request(server)
        .post("/api/vacations/1/users")
        .send({ username: "User2" })
        .set("authorization", token);

      expect(res.status).toBe(201);
    });
  });

  describe("DELETE /api/vacations/:vid/users/:id", () => {
    it("should return status 202 on successful request", async () => {
      const user = await db("users")
        .where({ id: 1 })
        .first();

      const token = generateToken(user);

      await dbUservacations.add({ user_id: 2, vacation_id: 1 });
      const res = await request(server)
        .delete("/api/vacations/1/users/2")
        .set("authorization", token);

      expect(res.status).toBe(202);
    });
  });
});
