exports.up = function(knex) {
  return knex.schema
    .createTable("users", tbl => {
      tbl.increments();
      tbl
        .string("username", 255)
        .notNullable()
        .unique();
      tbl.string("password", 255).notNullable();
      tbl.string("avatar", 255);
    })
    .createTable("vacations", tbl => {
      tbl.increments();
      tbl.string("name", 255).notNullable();
      tbl.string("description", 255);
      tbl.string("place", 255);
      tbl.string("picture", 255);
      tbl
        .integer("owner_id")
        .unsigned()
        .references("users.id")
        .onDelete("cascade")
        .onUpdate("cascade");
    })
    .createTable("user_vacations", tbl => {
      tbl.increments();
      tbl
        .integer("user_id")
        .unsigned()
        .references("users.id")
        .onDelete("cascade")
        .onUpdate("cascade");
      tbl
        .integer("vacation_id")
        .unsigned()
        .references("vacations.id")
        .onDelete("cascade")
        .onUpdate("cascade");
    })
    .createTable("activities", tbl => {
      tbl.increments();
      tbl.string("name", 255).notNullable();
      tbl.string("description", 255);
      tbl
        .integer("vacation_id")
        .unsigned()
        .references("vacations.id")
        .onDelete("cascade")
        .onUpdate("cascade");
    })
    .createTable("dates", tbl => {
      tbl.increments();
      tbl.date("start");
      tbl.date("end");
      tbl
        .integer("vacation_id")
        .unsigned()
        .references("vacations.id")
        .onDelete("cascade")
        .onUpdate("cascade");
    })
    .createTable("comments", tbl => {
      tbl.increments();
      tbl.text("body").notNullable();
      tbl
        .integer("created_by")
        .unsigned()
        .references("users.id")
        .onDelete("cascade")
        .onUpdate("cascade");
      tbl
        .integer("vacation_id")
        .unsigned()
        .references("vacations.id")
        .onDelete("cascade")
        .onUpdate("cascade");
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("messages")
    .dropTableIfExists("comments")
    .dropTableIfExists("dates")
    .dropTableIfExists("activities")
    .dropTableIfExists("places")
    .dropTableIfExists("user_vacations")
    .dropTableIfExists("vacations")
    .dropTableIfExists("users");
};
