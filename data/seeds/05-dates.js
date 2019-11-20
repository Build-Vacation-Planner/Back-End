exports.seed = function(knex) {
  return knex("dates").insert([
    { start: "2020-03-08", end: "2020-03-15", vacation_id: 1 },
    { start: "2019-12-20", end: "2019-12-27", vacation_id: 2 },
    { start: "2019-12-20", end: "2019-12-27", vacation_id: 3 }
  ]);
};
