import { useState } from "react";
import { fetchPost } from "./Api.tsx";

const DisplaySuggestions = ({ suggestions, dispatch }) => {
  return suggestions.map(({ user, _id, isSubscribed }, i: number) => {
    return (
      <div key={i}>
        {user}
        <button
          type="button"
          onClick={async (e) => {
            e.preventDefault();
            await fetchPost("toggle-subscribe", {
              id: _id,
            }).then((res) => {
              if (res.posts) {
                dispatch({ act: "render-posts", posts: res.posts });
              } else dispatch({ act: "remove-posts", id: res.id });
            });

            (e.target as HTMLElement).innerText =
              (e.target as HTMLElement).innerText === "Unsubscribe"
                ? "Subscribe"
                : "Unsubscribe";
          }}
        >
          {isSubscribed ? "Unsubscribe" : "Subscribe"}
        </button>
      </div>
    );
  });
};

const SearchHead = () => <h1>Search Users</h1>;

const SearchBarInput = ({ setName }) => (
  <input
    type="search"
    placeholder="search users"
    onChange={(e) => {
      setName(e.target.value);
    }}
  />
);

const SearchBtn = ({ setSuggestions, initials }) => (
  <span
    onClick={async (e) => {
      e.preventDefault();
      if (initials.trim().length > 0) {
        await fetchPost("search-users", { initials }).then((res) => {
          setSuggestions(res);
        });
      } else {
        setSuggestions([]);
      }
    }}
  >
    Search
  </span>
);

const SearchList = ({ suggestions, dispatch }) => (
  <div>
    <DisplaySuggestions suggestions={suggestions} dispatch={dispatch} />
  </div>
);

export const SearchBar = ({ dispatch }) => {
  const [search, setName] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  return (
    <>
      <SearchHead />
      <SearchBarInput setName={setName} />
      <SearchBtn initials={search} setSuggestions={setSuggestions} />
      <SearchList suggestions={suggestions} dispatch={dispatch} />
    </>
  );
};
