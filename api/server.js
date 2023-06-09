const express = require("express");
const server = express();
const knex = require("knex")(
  require("./knexfile.js")[process.env.NODE_ENV || "development"]
);
var cors = require("cors");
const port = 8080;

server.use(express.json());
server.use(cors());

server.get("/movies", (req, res) => {
  knex("movies").then((data) => res.status(200).json(data));
});

server.get("/movies/:name", (req, res) => {
  const query = req.params.name;

  knex("movies")
    .where("name", "ILIKE", `%${query}%`)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => console.log(err));
});

server.post("/movies", (req, res) => {
  const body = req.body;
  let newMovie = {};

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.MOVIES_API_KEY,
    },
  };

  fetch(
    `https://api.themoviedb.org/3/search/movie?query=${body.name}&include_adult=false&language=en-US&page=1`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      const movieID = data.results[0].id;
      fetch(
        `https://api.themoviedb.org/3/movie/${movieID}?language=en-US`,
        options
      )
        .then((response) => response.json())
        .then((movieData) => {
          newMovie = {
            movieid: movieData.id,
            title: movieData.title,
            poster: movieData.poster_path,
            tagline: movieData.tagline,
            genres: movieData.genres.map((genre) => genre.name),
            release: movieData.release_date,
            runtime: movieData.runtime,
            overview: movieData.overview,
            rating: movieData.vote_average,
          };
          knex("movies")
            .insert(newMovie)
            .then(() => res.status(201).json(`You added ${newMovie.title}!`))
            .catch((err) => {
              console.log(err);
              res.status(500).json(`You could not add ${newMovie.title}`);
            });
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
});

server.delete("/movies/:name", (req, res) => {
  query = req.params.name;

  knex("movies")
    .where("title", `${query}`)
    .del()
    .then(() => res.status(201).json(`You deleted ${query}!`))
    .catch((err) => {
      console.log(err);
      res.status(500).json(`You could not add ${query}`);
    });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
