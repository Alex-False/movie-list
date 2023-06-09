/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("movies", (table) => {
    table.increments();
    table.string("movieid");
    table.string("title");
    table.string("poster");
    table.string("tagline");
    table.specificType("genres", "text ARRAY");
    table.string("release");
    table.string("runtime");
    table.text("overview", "longtext");
    table.string("rating");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("movies");
};
