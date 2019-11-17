const db = require("../../data/dbConfig");
const dbAuth = require("../auth-model");

beforeEach(async () => {
  await db("users").truncate();
});

describe("Auth Models", () => {
  describe("getBy()", () => {
    it("should fetch a user that matches the username", async () => {
      await db("users").insert({ username: "Joker", password: "happyface" });

      const user = await dbAuth.getBy({ username: "Joker" });

      return expect(user).toBeTruthy();
    });

    it("should fetch a user that matches the id", async () => {
      await db("users").insert({ username: "Joker", password: "happyface" });

      const user = await dbAuth.getBy({ id: 1 });

      return expect(user).toBeTruthy();
    });
  });

  describe("add()", () => {
    it("should return recently added user", async () => {
      const user = await dbAuth.add({
        username: "Joker",
        password: "happyface"
      });

      return expect(user).toStrictEqual({ id: 1, username: "Joker" });
    });
  });
});
