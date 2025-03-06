import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const App = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const searchMovies = async (newSearch = false) => {
    if (!query.trim()) return;

    try {
      setError("");
      const response = await axios.get(`${API_URL}`, {
        params: {
          s: query,
          apikey: API_KEY,
          page: newSearch ? 1 : page,
        },
      });

      if (response.data.Response === "True") {
        setTotalResults(parseInt(response.data.totalResults));

        if (newSearch) {
          setMovies(response.data.Search);
          setPage(2);
        } else {
          setMovies((prevMovies) => [...prevMovies, ...response.data.Search]);
          setPage((prevPage) => prevPage + 1);
        }
      } else {
        setMovies([]);
        setError("No movies found.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Movie Search</h1>
      <p>Search for any movie to get title and year of release</p>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={() => searchMovies(true)} className="search-button">
          Search
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="movie-card">
            <img
              src={movie.Poster !== "N/A" ? movie.Poster : "https://placehold.co/200x300?text=No+Image"}
              alt={movie.Title}
            />
            <h2 className="movie-title">{movie.Title}</h2>
            <p className="movie-year">{movie.Year}</p>
          </div>
        ))}
      </div>

      {movies.length > 0 && movies.length < totalResults && (
        <div className="load-more-container">
          <button onClick={() => searchMovies()} className="load-more-button">
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
