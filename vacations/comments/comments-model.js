const db = require("../../data/dbConfig");

module.exports = { getBy, add, update, remove };

async function getBy(filter) {
  return await db("comments")
    .where(filter)
    .first();
}

async function add(comment) {
  const [id] = await db("comments")
    .insert(comment)
    .returning("id");

  return db("comments")
    .where({ id })
    .first();
}

async function update(changes, id) {
  await db("comments")
    .update(changes)
    .where({ id });

  return db("comments")
    .where({ id })
    .first();
}

async function remove(id) {
  return db("comments")
    .where({ id })
    .del();
}
