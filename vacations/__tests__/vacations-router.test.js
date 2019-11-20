const request = require("supertest");
const bcrypt = require("bcryptjs");
const cleaner = require("knex-cleaner");
const generateToken = require("../../auth/generate-token");

const server = require("../../api/server");
const db = require("../../data/dbConfig");
const dbVacations = require("../vacations-model");

beforeEach(async () => {
  await cleaner.clean(db);
  await db("users").insert({
    username: "Test4",
    password: bcrypt.hashSync("Test4", 12)
  });
});

describe("Vacations", () => {
  describe("POST /api/vacations", () => {
    it("should return status 201 on successful request", async () => {
      const user = await db("users")
        .where({ id: 1 })
        .first();

      const token = generateToken(user);

      const res = await request(server)
        .post("/api/vacations/")
        .send({
          name: "Summer Vacation",
          place: "Los Angeles",
          description: "Cool place to relax"
        })
        .set("authorization", token);

      expect(res.status).toBe(201);
    });
  });

  describe("PUT /api/vacations/:id", () => {
    it("should return status 202 on successful request", async () => {
      const user = await db("users")
        .where({ id: 1 })
        .first();

      const token = generateToken(user);

      await dbVacations.add({
        name: "Summer Vacation",
        owner_id: user.id
      });
      const res = await request(server)
        .put("/api/vacations/1")
        .send({
          name: "Winter Vacation",
          place: "Los Angeles",
          description: "Cool place to relax"
        })
        .set("authorization", token);

      expect(res.status).toBe(202);
    });
  });

  describe("DELETE /api/vacations/:id", () => {
    it("should return status 202 on successful request", async () => {
      const user = await db("users")
        .where({ id: 1 })
        .first();

      const token = generateToken(user);

      await db("vacations").insert({
        name: "Summer Vacation",
        owner_id: 1
      });
      const res = await request(server)
        .delete("/api/vacations/1")
        .set("authorization", token);

      expect(res.status).toBe(202);
    });
  });
});
