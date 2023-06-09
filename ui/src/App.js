import { useEffect, useState } from "react";
import "./App.css";
import { AiOutlinePlus, AiOutlineClose, AiOutlineEnter } from "react-icons/ai";

function App() {
  const [allMovies, setAllMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [addMovie, setAddMovie] = useState({
    name: "",
  });
  const [addMovieInput, setAddMovieInput] = useState("");
  const [addToggle, setAddToggle] = useState(true);
  const [watched, setWatched] = useState([]);
  const [visable, setVisable] = useState();

  const fetchMovies = () => {
    fetch("http://localhost:8080/movies")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setAllMovies(data);
      })
      .catch((err) => console.log(err));
  };

  const searchForName = (e) => {
    let searchText = e.target.value.toLowerCase();
    let filteredMovies = allMovies.filter((movie) => {
      return movie.title.toLowerCase().includes(searchText);
    });
    setMovies(filteredMovies);
  };

  const movieWatched = (e, movie) => {
    e.stopPropagation();
    let id = movie.id;
    if (!watched.some((watchedMovie) => watchedMovie.id === id)) {
      setWatched([...watched, movie]);
    } else {
      setWatched(
        watched.filter((watchedMovie) => watchedMovie.id !== movie.id)
      );
    }
    console.log(watched);
  };

  const addMovieChange = (e) => {
    setAddMovieInput(e.target.value);
    setAddMovie({ ...addMovie, [e.target.name]: e.target.value });
    console.log(addMovie);
  };

  const clearAddMovie = () => {
    setAddMovieInput("");
    setAddMovie({
      name: "",
    });
    fetchMovies();
  };

  const addMoviePost = async () => {
    if (addToggle) {
      const response = await fetch("http://localhost:8080/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addMovie),
      });
      const data = await response.json();
      console.log(data);
      clearAddMovie();
    } else {
      fetch(`http://localhost:8080/movies/${addMovie.name}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          clearAddMovie();
          console.log(data);
        });
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="App">
      <div className="movie-search-container">
        <button
          className="movies-view-toggle"
          onClick={() => setMovies(watched)}
        >
          See watched movies!
        </button>
        <button
          className="movies-view-toggle"
          onClick={() =>
            setMovies(
              allMovies.filter(
                (movie) =>
                  !watched.some(
                    (watchedMovie) => watchedMovie.name === movie.name
                  )
              )
            )
          }
        >
          See movies to watch!
        </button>
        <button
          className="movies-view-toggle"
          onClick={() => setMovies(allMovies)}
        >
          See all movies!
        </button>
        <input
          className="movie-searchBar"
          onChange={searchForName}
          placeholder="Filter by movie title!"
        />
      </div>
      <div className="movie-container">
        {movies.length > 0
          ? movies.map((movie, index) => {
              return (
                <div className="movie-card" onClick={() => setVisable(movie)}>
                  <h1 className="movie-name" key={index}>
                    {movie.title}
                  </h1>
                  {!visable ? (
                    <button
                      className={`movie-watched ${
                        watched.some(
                          (watchedMovie) => watchedMovie.id === movie.id
                        )
                          ? "watched"
                          : ""
                      }`}
                      onClick={(e) => movieWatched(e, movie)}
                    >
                      {watched.some(
                        (watchedMovie) => watchedMovie.id === movie.id
                      ) ? (
                        <AiOutlineClose />
                      ) : (
                        <AiOutlinePlus />
                      )}
                    </button>
                  ) : null}
                  {visable && visable.id === movie.id ? (
                    <>
                      <button
                        className="close-card"
                        onClick={(e) => {
                          e.stopPropagation();
                          setVisable(null);
                        }}
                      >
                        <AiOutlineClose />
                      </button>
                      <img
                        src={`https://image.tmdb.org/t/p/w500/${movie.poster}`}
                      ></img>
                      <h3>{movie.tagline}</h3>
                      <h4>{movie.genres.map((genre) => `${genre} `)}</h4>
                      <p>{movie.release}</p>
                      <p>{movie.runtime} minutes</p>
                      <p>{movie.overview}</p>
                      <p>Rating: {movie.rating} / 10</p>
                      <button
                        className={`movie-watched ${
                          watched.some(
                            (watchedMovie) => watchedMovie.id === movie.id
                          )
                            ? "watched"
                            : ""
                        }`}
                        onClick={(e) => movieWatched(e, movie)}
                      >
                        {watched.some(
                          (watchedMovie) => watchedMovie.id === movie.id
                        ) ? (
                          <AiOutlineClose />
                        ) : (
                          <AiOutlinePlus />
                        )}
                      </button>
                    </>
                  ) : null}
                </div>
              );
            })
          : null}
      </div>
      <div className="movie-add-container">
        <select
          className="add-delete-toggle"
          onChange={() => {
            setAddToggle(!addToggle);
          }}
        >
          <option value="add">Add</option>
          <option value="delete">Delete</option>
        </select>
        <input
          name="name"
          className="movie-add-input"
          onChange={addMovieChange}
          value={addMovieInput}
          placeholder="Enter a movie title!"
        />
        <button className="movie-add-clear" onClick={addMoviePost}>
          Enter <AiOutlineEnter />
        </button>
      </div>
    </div>
  );
}

export default App;
