const db = require("../data/dbConfig");

module.exports = { getBy, add, update, remove };

async function getBy(filter) {
  return await db("vacations")
    .where(filter)
    .first();
}

async function add(vacation) {
  const [id] = await db("vacations")
    .insert(vacation)
    .returning("id");

  await db("user_vacations").insert(
    {
      user_id: vacation.owner_id,
      vacation_id: id
    },
    "id"
  );

  return db("vacations")
    .where({ id })
    .first();
}

async function update(changes, id) {
  await db("vacations")
    .update(changes)
    .where({ id });

  return db("vacations")
    .where({ id })
    .first();
}

async function remove(id) {
  return db("vacations")
    .where({ id })
    .del();
}
