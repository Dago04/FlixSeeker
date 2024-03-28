import { useState, useEffect } from "react";

export default function useLocalStorageState(initialState, key) {
    const [value, setValue] = useState(function () {
        // use a function to set the initial state
        const storedValue = localStorage.getItem(key); // get the stored value from localStorage
        return storedValue ? JSON.parse(storedValue) : initialState; // parse the stored value to JSON
    });
    useEffect(
        function () {
            // use an effect to store the watched movies in localStorage
            localStorage.setItem(key, JSON.stringify(value)); // store the watched movies in localStorage
        },
        [value, key]
    ); // run the effect when the watched movies change

    return [value, setValue];
}
