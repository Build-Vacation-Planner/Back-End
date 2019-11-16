const db = require("../data/dbConfig");

module.exports = { getBy, add };

async function getBy(filter) {
  const user = await db("users")
    .where(filter)
    .returning(["id", "username", "password"])
    .first();

  return user;
}

async function add(userData) {
  const [id] = await db("users")
    .insert(userData)
    .returning("id");

  return db("users")
    .select("id", "username")
    .where({ id })
    .first();
}
