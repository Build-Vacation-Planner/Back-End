const db = require("../../data/dbConfig");

module.exports = { add, update, remove };

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
