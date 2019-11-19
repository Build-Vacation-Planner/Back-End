const db = require("../../data/dbConfig");

module.exports = { getBy };

function getBy(filter) {
  return db("users")
    .where(filter)
    .select("id", "username")
    .first();
}
