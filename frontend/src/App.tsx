import { useEffect, useReducer, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { type Action, Reducer } from "./Reducer.ts";
import { DisplayFeed } from "./Feed.tsx";
import { fetchGet } from "./Api.tsx";
import { SearchBar } from "./SearchBar.tsx";
import { DisplayForm } from "./CreatePost.tsx";
import { Auth } from "./Authentication.tsx";
import CommentsPage from "./CommentsPage.tsx";

export type Dispatch = (action: Action) => void;

const MainPage = () => {
  const [posts, dispatch] = useReducer(Reducer, []);

  useEffect(() => {
    fetchGet("load-post").then((res) => {
      const posts = res.usersPost.flatMap((p) => ({
        ...p,
        currentUser: res.currentUser,
      }));
      dispatch({ act: "", posts });
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

  if (!_isLoggedIn) return <Auth setter={setLoggedIn} />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/post/:postId/comments" element={<CommentsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
