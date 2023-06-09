/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("movies").del();
  await knex("movies").insert([
    { name: "Mean Girls" },
    { name: "Hackers" },
    { name: "The Grey" },
    { name: "Sunshine" },
    { name: "Ex Machina" },
  ]);
};
