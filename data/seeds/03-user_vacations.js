exports.seed = function(knex) {
  return knex("user_vacations").insert([
    { user_id: 2, vacation_id: 1 },
    { user_id: 3, vacation_id: 2 },
    { user_id: 1, vacation_id: 3 },
    { user_id: 1, vacation_id: 2 },
    { user_id: 4, vacation_id: 1 },
    { user_id: 2, vacation_id: 3 },
    { user_id: 1, vacation_id: 1 },
    { user_id: 5, vacation_id: 1 },
    { user_id: 6, vacation_id: 2 },
    { user_id: 4, vacation_id: 3 }
  ]);
};
