import React, { useState, useEffect } from "react";
import useKey from "../useKey";
import Loader from "./Loader";
import StarRating from "../StarRating";
const KEY = "e33fbcea";
export default function MovieDetail({ selectId, onCloseMovie, onAddWatched, watched }) {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState("");

    const movieAlreadyRated = watched.find(
        (watchedMovie) => watchedMovie.imdbId === selectId
    ); // check if movie is already rated

    const watchedUserRating = watched.find(
        (movie) => movie.imdbId === selectId
    )?.userRating; // get the user rating of the movie

    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
    } = movie;

    function handleAdd() {
        const newWatchedMovie = {
            imdbId: selectId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(" ").at(0)),
            userRating,
        };
        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    useKey("Escape", onCloseMovie);
    useEffect(
        function () {
            async function getMovieDetails() {
                setIsLoading(true);
                const rest = await fetch(
                    `http://www.omdbapi.com/?apikey=${KEY}&i=${selectId}`
                );
                const data = await rest.json();

                setMovie(data);
                setIsLoading(false);
            }
            getMovieDetails();
        },
        [selectId]
    );

    useEffect(
        function () {
            if (!title) return;
            document.title = `Movie | ${title}`;

            return function () {
                document.title = "Movie List";
            };
        },
        [title]
    );

    return (
        <div className="details">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <header>
                        <button className="btn-back" onClick={onCloseMovie}>
                            ←
                        </button>
                        <img src={poster} alt={`Poster of ${movie}`} />
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>
                                {released} &bull; {runtime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>💛</span>
                                {imdbRating} IMDb rating
                            </p>
                        </div>
                    </header>
                    <section>
                        <div className="rating">
                            {!movieAlreadyRated ? (
                                <>
                                    <StarRating
                                        maxRating={10}
                                        size={24}
                                        onSetRating={setUserRating}
                                    />
                                    {userRating > 0 && (
                                        <button className="btn-add" onClick={handleAdd}>
                                            + Add to list
                                        </button>
                                    )}
                                </>
                            ) : (
                                <p>
                                    You rated this movie with {watchedUserRating} <span>⭐</span>
                                </p>
                            )}
                        </div>
                        <p>
                            <em>{plot}</em>
                        </p>
                        <p>Starring {actors}</p>
                        <p>Directed by {director}</p>
                    </section>
                </>
            )}
        </div>
    );
}