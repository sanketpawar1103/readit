import { type SubmitEvent, useEffect, useReducer, useState } from "react";
import { type Action, type Post, Reducer } from "./reducer.ts";
import { DisplayFeed } from "./Feed.tsx";
import { fetchGet, fetchPost } from "./Api.tsx";

export type Dispatch = (action: Action) => void;

type Res = { user: string; date: Date; id: string };

type DisplayFormProps = {
  saveThePost: (action: Action) => void;
  posts: Post[];
};

const FormTitle = () => <h1>Create Post</h1>;

const PostDescription = ({ setBody }) => (
  <>
    <p>Body</p>
    <textarea
      name="body"
      placeholder="Write your post..."
      rows={5}
      cols={50}
      onChange={(e) => setBody(e.target.value)}
    >
    </textarea>
  </>
);

const PostTitle = ({ setTitle }) => (
  <>
    <p>Title</p>
    <input
      type="text"
      placeholder="Enter a title..."
      name="title"
      onChange={(e) => setTitle(e.target.value)}
      required
    />
  </>
);

const AddPost = async (
  e: SubmitEvent<HTMLFormElement>,
  title: string,
  desc: string,
  saveThePost: Dispatch,
) => {
  e.preventDefault();
  const body = { title, body: desc };

  const { id, user, date }: Res = await fetchPost("add-post", body);
  saveThePost({ act: "add-post", id, ...body, user, date });
};

const DisplayForm = ({ saveThePost }: DisplayFormProps) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        await AddPost(e, title, body, saveThePost);
      }}
    >
      <FormTitle />
      <PostTitle setTitle={setTitle} />
      <PostDescription setBody={setBody} />
      <button type="submit">Post</button>
    </form>
  );
};

const Auth = ({ setter, isLoggedIn }) => {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");

  return (
    <>
      <h1>Login</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await fetchPost("login", {
            userName: name,
            password: pass,
          });

          setter(!isLoggedIn);
        }}
      >
        <input
          type="text"
          name="userName"
          required
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type="password"
          required
          onChange={(e) => {
            setPass(e.target.value);
          }}
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
};
const App = () => {
  const [posts, dispatch] = useReducer(Reducer, []);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetchGet("load-post").then((res) => dispatch({ act: "", posts: res }));
  }, []);

  return (
    <div>
      {isLoggedIn
        ? (
          <>
            <DisplayForm saveThePost={dispatch} posts={posts} />
            <DisplayFeed deleteThePost={dispatch} posts={posts} />
          </>
        )
        : <Auth isLoggedIn={isLoggedIn} setter={setLoggedIn} />}
    </div>
  );
};

export default App;
