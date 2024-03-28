import { useState } from "react";
import useMovies from "./useMovies";
import useLocalStorageState from "./useLocalStorageState";
import NavBar from "./Components/NavBar";
import Search from "./Components/Search";
import Main from "./Components/Main";
import Box from "./Components/Box";
import MovieDetail from "./Components/MovieDetail";
import Loader from "./Components/Loader";
import ErrorMessage from "./Components/ErrorMessage";
import MovieList from "./Components/MovieList";
import WatchedSummary from "./Components/WatchedSummary";
import WatchedMoviesList from "./Components/WatchedMoviesList";
import NumResults from "./Components/NumResults";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie); // custom hook to fetch movies
  const [watched, setWatched] = useLocalStorageState([], "watched"); // custom hook to store watched movies in localStorage

  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    console.log(watched);
    setWatched((watched) => watched.filter((movie) => movie.imdbId !== id)); // filter out the movie with the id that needs to be deleted
  }

  return (
    <>
      <NavBar>
        <Search setQuery={setQuery} query={query} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>

          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetail
              selectId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
