import { useState } from "react";

const suggestions = [
  { name: "Sanket", isSubscribed: false },
  { name: "Vikas", isSubscribed: true },
  { name: "Vivek", isSubscribed: false },
];

const DisplaySuggestions = ({ search }: { search: string }) => {
  return suggestions
    .filter(({ name }) =>
      name.toLowerCase().startsWith(search.toLocaleLowerCase())
    )
    .map(({ name, isSubscribed }, i) => (
      <div key={i}>
        {name}
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

export const SearchBar = () => {
  const [name, setName] = useState("");

  return (
    <>
      <h1>Search Users</h1>
      <search></search>
      <input
        type="search"
        placeholder="search users"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <span>Search</span>
      <div>
        {name.trim().length !== 0 && <DisplaySuggestions search={name} />}
      </div>
    </>
  );
};
