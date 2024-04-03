import { useEffect, useState } from "react";
const KEY = "e33fbcea";
export default function useMovies(query, callback) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(
        function () {
            callback?.(); // run the callback function if it exists
            const controller = new AbortController();
            async function fetchMovies() {
                try {
                    setIsLoading(true);
                    setError("");
                    const rest = await fetch(
                        `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
                        { signal: controller.signal }
                    );

                    if (!rest.ok)
                        throw new Error("Something went wrong with fetching movies!."); // this is a custom error message
                    const data = await rest.json();
                    if (data.Response === "False") throw new Error("Movie not found!"); // this is a custom error message
                    setMovies(data.Search);
                    setError("");
                } catch (err) {
                    console.log(err.message);
                    if (err.name !== "AbortError") {
                        setError(err.message);
                    }
                } finally {
                    setIsLoading(false);
                }
            }
            if (query.length < 3) {
                // if query is less than 3 characters, clear the movies array and error message
                setMovies([]);
                setError("");
                return;
            }

            fetchMovies();

            return function () {
                controller.abort();
            };
        },
        [query]
    );

    return { movies, isLoading, error };
}