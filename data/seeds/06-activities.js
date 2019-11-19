exports.seed = function(knex) {
  return knex("activities").insert([
    { name: "Drink", vacation_id: 1 },
    { name: "Drink again", vacation_id: 1 },
    { name: "Drink some more", vacation_id: 1 },
    { name: "Sskiing", vacation_id: 2 },
    { name: "Gambling", vacation_id: 2 },
    { name: "Clubbing", vacation_id: 2 },
    { name: "Xcaret", description: "Wild life tour", vacation_id: 3 }
  ]);
};
