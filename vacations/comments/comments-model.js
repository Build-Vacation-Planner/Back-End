const db = require("../../data/dbConfig");

module.exports = { add, update, remove };

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
