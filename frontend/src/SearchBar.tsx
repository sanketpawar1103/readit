import { useState } from "react";
import { fetchPost } from "./Api.tsx";

const DisplaySuggestions = ({ suggestions }) => {
  return suggestions.map(({ user, isSubscribed }, i: number) => (
    <div key={i}>
      {user}
      <button
        type="button"
        onClick={(e) => {
          (e.target as HTMLElement).innerText = isSubscribed
            ? "Unsubscribe"
            : "Subscribe";
          isSubscribed = !isSubscribed;
        }}
      >
        subscribe
      </button>
    </div>
  ));
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
          console.log({ res });
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

const SearchList = ({ suggestions }) => (
  <div>
    <DisplaySuggestions suggestions={suggestions} />
  </div>
);

export const SearchBar = () => {
  const [search, setName] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  return (
    <>
      <SearchHead />
      <SearchBarInput setName={setName} />
      <SearchBtn initials={search} setSuggestions={setSuggestions} />
      <SearchList suggestions={suggestions} />
    </>
  );
};
