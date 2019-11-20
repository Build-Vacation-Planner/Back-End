const request = require("supertest");
const bcrypt = require("bcryptjs");
const cleaner = require("knex-cleaner");
const generateToken = require("../../auth/generate-token");

const server = require("../../api/server");
const db = require("../../data/dbConfig");

beforeEach(async () => {
  await cleaner.clean(db);
  await db("users").insert({
    username: "Test3",
    password: bcrypt.hashSync("Test3", 12)
  });
  await db("vacations").insert({ name: "Summer Vacations", owner_id: 1 });
});

describe("Comments", () => {
  describe("POST /api/vacations/:vid/comments", () => {
    it("should return status 201 on successful request", async () => {
      const user = await db("users")
        .where({ id: 1 })
        .first();

      const token = generateToken(user);

      const res = await request(server)
        .post("/api/vacations/1/comments")
        .send({ body: "Comment test text here" })
        .set("authorization", token);

      expect(res.status).toBe(201);
    });
  });
  describe("PUT /api/vacations/:vid/comments/:id", () => {
    it("should return status 202 on successful request", async () => {
      const user = await db("users")
        .where({ id: 1 })
        .first();

      const token = generateToken(user);

      await db("comments").insert({ body: "Comment test text here" });
      const res = await request(server)
        .put("/api/vacations/1/comments/1")
        .send({ body: "Comment test text here2" })
        .set("authorization", token);

      expect(res.status).toBe(202);
    });
  });

  describe("DELETE /api/vacations/:vid/comments/:id", () => {
    it("should return status 202 on successful request", async () => {
      const user = await db("users")
        .where({ id: 1 })
        .first();

      const token = generateToken(user);

      await db("comments").insert({ body: "Comment test text here" });
      const res = await request(server)
        .delete("/api/vacations/1/comments/1")
        .set("authorization", token);

      expect(res.status).toBe(202);
    });
  });
});
