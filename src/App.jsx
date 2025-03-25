import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const App = () => {
  //React states
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  
  const searchMovies = async (newSearch = false) => {
    //if search bar is empty return / don't search an empty string
    if (!query.trim()) return; 

    try {
      //clear current error message
      setError("");
      // call OMDB API 
      const response = await axios.get(`${API_URL}`, { 
        params: {
          s: query,
          apikey: API_KEY,
          page: newSearch ? 1 : page,
        },
      });

      if (response.data.Response === "True") {
        //if the API call is successful set total results as an int
        setTotalResults(parseInt(response.data.totalResults)); 

        if (newSearch) {
          //set movies list with the restults upon new search
          setMovies(response.data.Search); 
          setPage(2); 
        } else {
          //keep previously loaded movies and add 10 more results then add 1 to current page
          setMovies((prevMovies) => [...prevMovies, ...response.data.Search]); 
          setPage((prevPage) => prevPage + 1); 
        }
      } else { // if API call is unsuccessful clear movie list and set an error
        setMovies([]);
        setError("No movies found.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (

    // return in the page order from top to bottom title > serach bar > error if applicable > movie grid > load more button
    <div className="container">
      <h1 className="title">Movie Search</h1>
      <p>Search for any movie to get title and year of release</p>
      <div className="search-bar">
        {/* set query with each change in input*/}
        <input type="text" placeholder="Search for a movie..." value={query} onChange={(e) => setQuery(e.target.value)} className="search-input"/> 
        <button onClick={() => searchMovies(true)} className="search-button"> Search </button> 
      </div>

      {/* show an error if there is one otherwise show nothing*/}
      {error && <p className="error-message">{error}</p>} 

      <div className="movie-grid">
        {/* loop through each movie and return a div with image (or placeholder), title, and year*/}
        {movies.map((movie) => (
          <div key={movie.imdbID} className="movie-card">
            <img src={movie.Poster !== "N/A" ? movie.Poster : "https://placehold.co/200x300?text=No+Image"} alt={movie.Title}/> 
            <h2 className="movie-title">{movie.Title}</h2>
            <p className="movie-year">{movie.Year}</p>
          </div>
        ))}
      </div>

      {/* if there is at least 1 movie and we are not at the last result then show load more button */}
      {movies.length > 0 && movies.length < totalResults && (
        <div className="load-more-container">
          <button onClick={() => searchMovies()} className="load-more-button"> Load More </button>
        </div>
      )}

    </div>
  );
};

export default App;
