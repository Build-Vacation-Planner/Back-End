const request = require("supertest");
const bcrypt = require("bcryptjs");
const cleaner = require("knex-cleaner");

const server = require("../../api/server");
const db = require("../../data/dbConfig");

beforeEach(async () => {
  await cleaner.clean(db);
});

describe("Auth Router", () => {
  describe("POST /register", () => {
    it("should return status 201 on successful request", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send({ username: "joker", password: "happyface" });

      expect(res.status).toBe(201);
    });

    it("should return a token on successful request", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send({ username: "joker", password: "happyface" });

      expect(res.body.token).toBeTruthy();
    });

    it("should return an array of errors when password or username are missing", async () => {
      const res = await request(server).post("/api/auth/register");

      expect(res.body.errors).toHaveLength(2);
    });

    it("should return status 400 when username or password is missing", async () => {
      const res = await request(server).post("/api/auth/register");

      expect(res.status).toBe(400);
    });

    it("should return status 400 when username isn't unique", async () => {
      const [id] = await db("users")
        .insert({ username: "joker", password: "happyface" })
        .returning("id");

      await db("users")
        .select("id", "username")
        .where({ id })
        .first();

      const res = await request(server)
        .post("/api/auth/register")
        .send({ username: "joker", password: "happyface" });

      expect(res.status).toBe(400);
    });
  });

  describe("POST /login", () => {
    it("should return status 200 on successful request", async () => {
      const [id] = await db("users")
        .insert({
          username: "joker",
          password: bcrypt.hashSync("happyface", 12)
        })
        .returning("id");

      await db("users")
        .select("id", "username")
        .where({ id })
        .first();

      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "joker", password: "happyface" });

      expect(res.status).toBe(200);
    });

    it("should return a token on successful request", async () => {
      const [id] = await db("users")
        .insert({
          username: "joker",
          password: bcrypt.hashSync("happyface", 12)
        })
        .returning("id");

      await db("users")
        .select("id", "username")
        .where({ id })
        .first();

      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "joker", password: "happyface" });

      expect(res.body.token).toBeTruthy();
    });

    it("should return an array of errors when password or username are missing", async () => {
      const res = await request(server).post("/api/auth/login");

      expect(res.body.errors).toHaveLength(2);
    });

    it("should return status 400 when username or password is missing", async () => {
      const res = await request(server).post("/api/auth/login");

      expect(res.status).toBe(400);
    });

    it("should return status 401 when providing incorrect password", async () => {
      const [id] = await db("users")
        .insert({
          username: "joker",
          password: bcrypt.hashSync("happyface", 12)
        })
        .returning("id");

      await db("users")
        .select("id", "username")
        .where({ id })
        .first();

      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "joker", password: "happyface1" });

      expect(res.status).toBe(401);
    });

    it("should return status 401 when providing a username that doesn't exist", async () => {
      const [id] = await db("users")
        .insert({
          username: "joker",
          password: bcrypt.hashSync("happyface", 12)
        })
        .returning("id");

      await db("users")
        .select("id", "username")
        .where({ id })
        .first();

      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "joker1", password: "happyface" });

      expect(res.status).toBe(401);
    });
  });
});
