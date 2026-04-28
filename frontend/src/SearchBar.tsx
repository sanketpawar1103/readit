import { useState } from "react";
import { fetchPost } from "./Api.tsx";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const manageSubscriptions = async (
  _id: string,
  dispatch,
  setSubscribed,
  subscribed: boolean,
) => {
  await fetchPost("toggle-subscribe", {
    id: _id,
  }).then((res) =>
    res.posts
      ? dispatch({ act: "render-posts", posts: res.posts })
      : dispatch({ act: "remove-posts", id: res.id })
  );

  setSubscribed(!subscribed);
};

const SubscribeButton = ({ subscribed, _id, dispatch, setSubscribed }) => (
  <Button
    type="button"
    variant={subscribed ? "outlined" : "contained"}
    onClick={async () => {
      await manageSubscriptions(_id, dispatch, setSubscribed, subscribed);
    }}
  >
    {subscribed ? "Unsubscribe" : "Subscribe"}
  </Button>
);

const Suggestions = ({ isSubscribed, user, _id, dispatch }) => {
  const [subscribed, setSubscribed] = useState(isSubscribed);

  return (
    <Card key={_id} sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row">
          <Typography variant="body1" className="pr-40">
            {user}
          </Typography>
          <SubscribeButton
            _id={_id}
            subscribed={subscribed}
            setSubscribed={setSubscribed}
            dispatch={dispatch}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

const DisplaySuggestions = ({ suggestions, dispatch }) => {
  return suggestions.map(({ user, _id, isSubscribed }) => (
    <Suggestions
      isSubscribed={isSubscribed}
      user={user}
      _id={_id}
      dispatch={dispatch}
    />
  ));
};
const SearchHead = () => (
  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
    Search Users
  </Typography>
);

const SearchBarInput = ({ setName }) => (
  <TextField
    type="search"
    label="Search users"
    variant="outlined"
    fullWidth
    onChange={(e) => {
      setName(e.target.value);
    }}
  />
);

const SearchBtn = ({ setSuggestions, initials }) => (
  <Button
    variant="contained"
    onClick={async () => {
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
  </Button>
);

const SearchList = ({ suggestions, dispatch }) => (
  <Stack sx={{ mt: 3 }}>
    <DisplaySuggestions suggestions={suggestions} dispatch={dispatch} />
  </Stack>
);

export const SearchBar = ({ dispatch }) => {
  const [search, setName] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  return (
    <Stack sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <SearchHead />

      <Stack direction="row" spacing={2}>
        <SearchBarInput setName={setName} />
        <SearchBtn initials={search} setSuggestions={setSuggestions} />
      </Stack>

      <SearchList suggestions={suggestions} dispatch={dispatch} />
    </Stack>
  );
};
