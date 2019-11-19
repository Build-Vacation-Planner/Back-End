const db = require("../../data/dbConfig");

module.exports = { getBy, add, remove };

async function getBy(filter) {
  return db("user_vacations")
    .where(filter)
    .returning(["id"])
    .first();
}

async function add(idPair) {
  return db("user_vacations")
    .insert(idPair)
    .returning("id");
}

async function remove(idPair) {
  return db("user_vacations")
    .where(idPair)
    .del();
}
