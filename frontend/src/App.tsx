import { useEffect, useReducer, useState } from "react";
import { type Action, type Post, Reducer } from "./Reducer.ts";
import { DisplayFeed } from "./Feed.tsx";
import { fetchGet } from "./Api.tsx";
import { SearchBar } from "./SearchBar.tsx";
import { DisplayForm } from "./CreatePost.tsx";
import { Auth } from "./Authentication.tsx";

export type Dispatch = (action: Action) => void;
type LoadPageAttr = { dispatch: Dispatch; posts: Post[] };

const LoadPage = ({ dispatch, posts }: LoadPageAttr) => {
  const [_isLoggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      {_isLoggedIn
        ? (
          <>
            <SearchBar />
            <DisplayForm saveThePost={dispatch} posts={posts} />
            <DisplayFeed deleteThePost={dispatch} posts={posts} />
          </>
        )
        : <Auth setter={setLoggedIn} dispatch={dispatch} />}
    </div>
  );
};

const App = () => {
  const [posts, dispatch] = useReducer(Reducer, []);

  useEffect(() => {
    fetchGet("load-post").then((res) => {
      dispatch({ act: "", posts: res.usersPost });
    });
  }, []);

  return <LoadPage dispatch={dispatch} posts={posts} />;
};

export default App;
