import { useEffect, useReducer, useState } from "react";
import { type Action, type Post, Reducer } from "./reducer";

type Feed = {
  post: Post;
  posts: Post[];
  deleteThePost: (act: string, x: Post[]) => void;
};

type DisplayFormProps = {
  saveThePost: (action: Action) => void;
  posts: Post[];
};

type DeletePost = {
  posts: Post[];
  deleteThePost: (action: Action) => void;
};

type FeedProps = {
  post: Post;
  deleteThePost: (action: Action) => void;
};

const fetPost = (body: { title: string; body: string }) =>
  fetch("http://localhost:8000/add-post", {
    method: "post",
    body: JSON.stringify(body),
  })
    .then((x) => x.json())
    .then((x) => x);

const FormTitle = () => <h1>Create Post</h1>;

const DisplayForm = ({ saveThePost, posts }: DisplayFormProps) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        // const id = posts[posts.length - 1].id + 1 || 1;
        const id: number = await fetPost({ title, body });
        console.log(id);
        saveThePost({ act: "add-post", title, id, body });
      }}
    >
      <FormTitle />
      <p>Title</p>
      <input
        type="text"
        placeholder="Enter a title..."
        name="title"
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <p>Body</p>
      <textarea
        name="body"
        placeholder="Write your post..."
        rows={5}
        cols={50}
        onChange={(e) => setBody(e.target.value)}
      >
      </textarea>
      <button type="submit">Post</button>
    </form>
  );
};

const Feed = ({ post, deleteThePost }: FeedProps) => {
  return (
    <>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <button
        onClick={() => {
          deleteThePost({ act: "delete-post", post });
        }}
      >
        Delete
      </button>
      <hr />
    </>
  );
};

const CreateFeed = ({ posts, deleteThePost }: DeletePost) =>
  posts.map((p) => <Feed post={p} key={p.id} deleteThePost={deleteThePost} />);

const DisplayFeed = ({ posts, deleteThePost }: DeletePost) => {
  return (
    <div>
      <h1>Feed</h1>
      <CreateFeed posts={posts} deleteThePost={deleteThePost} />
    </div>
  );
};

const App = () => {
  const dummyPosts: Post[] = [{ title: "sanket", body: "Step Intern", id: 1 }];
  const [posts, dispatch] = useReducer(Reducer, dummyPosts);

  useEffect(() => {
    fetch("https://localhost:8000/load-post")
      .then((x) => x.json())
      .then((x) => dispatch(x));
  }, []);

  return (
    <div>
      <DisplayForm saveThePost={dispatch} posts={posts} />
      <DisplayFeed deleteThePost={dispatch} posts={posts} />
    </div>
  );
};

export default App;
