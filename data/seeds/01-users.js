const bcrypt = require("bcryptjs");
const faker = require("faker");

exports.seed = async function(knex) {
  return knex("users").insert([
    {
      username: faker.name.firstName(),
      password: `${bcrypt.hashSync("pass", 12)}`,
      avatar: faker.image.avatar()
    },
    {
      username: faker.name.firstName(),
      password: `${bcrypt.hashSync("pass", 12)}`,
      avatar: faker.image.avatar()
    },
    {
      username: faker.name.firstName(),
      password: `${bcrypt.hashSync("pass", 12)}`,
      avatar: faker.image.avatar()
    },
    {
      username: faker.name.firstName(),
      password: `${bcrypt.hashSync("pass", 12)}`,
      avatar: faker.image.avatar()
    },
    {
      username: faker.name.firstName(),
      password: `${bcrypt.hashSync("pass", 12)}`,
      avatar: faker.image.avatar()
    },
    {
      username: faker.name.firstName(),
      password: `${bcrypt.hashSync("pass", 12)}`,
      avatar: faker.image.avatar()
    }
  ]);
};
