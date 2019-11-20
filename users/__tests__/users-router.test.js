const request = require("supertest");
const bcrypt = require("bcryptjs");
const cleaner = require("knex-cleaner");
const generateToken = require("../../auth/generate-token");

const server = require("../../api/server");
const db = require("../../data/dbConfig");

beforeEach(async () => {
  await cleaner.clean(db);
  await db("users").insert({
    username: "User",
    password: bcrypt.hashSync("Test1", 12)
  });
  await db("vacations").insert({ name: "Summer Vacations", owner_id: 1 });
});

describe("Users", () => {
  describe("GET /api/users", () => {
    it("should return status 201 on successful request", async () => {
      const user = await db("users")
        .where({ id: 1 })
        .first();

      const token = generateToken(user);

      const res = await request(server)
        .get("/api/users")
        .set("authorization", token);

      expect(res.status).toBe(200);
    });
  });

  describe("PUT /api/users", () => {
    it("should return status 202 on successful request", async () => {
      const user = await db("users")
        .where({ id: 1 })
        .first();

      const token = generateToken(user);

      const res = await request(server)
        .put("/api/users/")
        .send({ username: "James" })
        .set("authorization", token);

      expect(res.status).toBe(202);
    });
  });
});
