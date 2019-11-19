const db = require("../../data/dbConfig");

module.exports = { getBy, add, update, remove };

async function getBy(filter) {
  return db("dates")
    .where(filter)
    .first();
}

async function add(dates) {
  const [id] = await db("dates")
    .insert(dates)
    .returning("id");

  return db("dates")
    .where({ id })
    .first();
}

async function update(changes, id) {
  await db("dates")
    .update(changes)
    .where({ id });

  return db("dates")
    .where({ id })
    .first();
}

async function remove(id) {
  return db("dates")
    .where({ id })
    .del();
}
