import { useEffect, useReducer, useState } from "react";
import { type Action, Reducer } from "./Reducer.ts";
import { DisplayFeed } from "./Feed.tsx";
import { fetchGet } from "./Api.tsx";
import { SearchBar } from "./SearchBar.tsx";
import { DisplayForm } from "./CreatePost.tsx";
import { Auth } from "./Authentication.tsx";

export type Dispatch = (action: Action) => void;

const MainPage = () => {
  const [posts, dispatch] = useReducer(Reducer, []);

  useEffect(() => {
    fetchGet("load-post").then((res) => {
      dispatch({ act: "", posts: res.usersPost });
    });
  }, []);

  return (
    <>
      <SearchBar dispatch={dispatch} />
      <DisplayForm saveThePost={dispatch} posts={posts} />
      <DisplayFeed deleteThePost={dispatch} posts={posts} />
    </>
  );
};

const App = () => {
  const [_isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetchGet("get-user-data").then(({ success }) => setLoggedIn(success));
  }, [_isLoggedIn]);

  return <div>{_isLoggedIn ? <MainPage /> : <Auth setter={setLoggedIn} />}
  </div>;
};

export default App;
