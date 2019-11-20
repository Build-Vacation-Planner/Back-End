const bcrypt = require("bcryptjs");
const faker = require("faker");

exports.seed = async function(knex) {
  return knex("users").insert([
    {
      username: "Adriel",
      password: `${bcrypt.hashSync("pass", 12)}`,
      avatar: faker.image.avatar()
    },
    {
      username: "Rey",
      password: `${bcrypt.hashSync("pass", 12)}`,
      avatar: faker.image.avatar()
    },
    {
      username: "Jamie",
      password: `${bcrypt.hashSync("pass", 12)}`,
      avatar: faker.image.avatar()
    },
    {
      username: "Denise",
      password: `${bcrypt.hashSync("pass", 12)}`,
      avatar: faker.image.avatar()
    },
    {
      username: "Monte",
      password: `${bcrypt.hashSync("pass", 12)}`,
      avatar: faker.image.avatar()
    },
    {
      username: "Adam",
      password: `${bcrypt.hashSync("pass", 12)}`,
      avatar: faker.image.avatar()
    }
  ]);
};
