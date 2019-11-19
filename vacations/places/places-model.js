const db = require("../../data/dbConfig");

module.exports = { add, update, remove };

async function add(place) {
  const [id] = await db("places")
    .insert(place)
    .returning("id");

  return db("places")
    .where({ id })
    .first();
}

async function update(changes, id) {
  await db("places")
    .update(changes)
    .where({ id });

  return db("places")
    .where({ id })
    .first();
}

async function remove(id) {
  return db("places")
    .where({ id })
    .del();
}
