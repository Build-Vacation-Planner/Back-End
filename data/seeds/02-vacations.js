const faker = require("faker");

exports.seed = function(knex) {
  return knex("vacations").insert([
    {
      name: "Spring Break",
      place: "South Padre Island",
      owner_id: 2,
      picture: faker.image.city()
    },
    {
      name: "Christmas Vacation",
      description: "Something that describes this vacation",
      owner_id: 3,
      picture: faker.image.city()
    },
    {
      name: "Summer Vaction",
      description: "Summer getaway to some beach",
      place: "Cancun",
      owner_id: 1,
      picture: faker.image.city()
    }
  ]);
};
