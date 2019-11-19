exports.seed = function(knex) {
  return knex("comments").insert([
    {
      body: "Where's South Padre Island",
      created_by: 2,
      vacation_id: 1
    },
    { body: "Are you for real?", created_by: 1, vacation_id: 1 },
    {
      body: "Get that person out of here please",
      created_by: 5,
      vacation_id: 1
    },
    { body: "Suggest places to travel", created_by: 1, vacation_id: 2 },
    { body: "Las Vegas for xmas?", created_by: 6, vacation_id: 2 },
    { body: "weird place but ok", created_by: 3, vacation_id: 2 },
    { body: "Cancun here we go", created_by: 1, vacation_id: 3 },
    { body: "OMG so pumped for cancun", created_by: 4, vacation_id: 3 },
    { body: "Hello anyone?", created_by: 4, vacation_id: 3 }
  ]);
};
