// Update with your config settings.

module.exports = {
  development: {
    client: "pg",
    connection: {
      database: process.env.DB_DEV_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds"
    }
  },

  testing: {
    client: "pg",
    connection: {
      database: process.env.DB_TEST_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds"
    }
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds"
    }
  }
};
