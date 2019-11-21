const db = require("../../data/dbConfig");

module.exports = { getBy, add, update, remove };

async function getBy(filter) {
  return await db("comments")
    .where(filter)
    .first();
}

async function add(activity) {
  const [id] = await db("activities")
    .insert(activity)
    .returning("id");

  return db("activities")
    .where({ id })
    .first();
}

async function update(changes, id) {
  await db("activities")
    .update(changes)
    .where({ id });

  return db("activities")
    .where({ id })
    .first();
}

async function remove(id) {
  return db("activities")
    .where({ id })
    .del();
}
