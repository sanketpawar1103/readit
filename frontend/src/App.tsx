import { type SubmitEvent, useEffect, useReducer, useState } from "react";
import { type Action, type Post, Reducer } from "./reducer.ts";

type Dispatch = (action: Action) => void;

type id = string;

type Body = { title: string; body: string } | { id: string };

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

const fetchPost = (endPoint: string, body: Body) =>
  fetch(`http://localhost:8000/${endPoint}`, {
    method: "post",
    body: JSON.stringify(body),
  })
    .then((x) => x.json())
    .then((x) => x);

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

  const _id: id = await fetchPost("add-post", body);
  saveThePost({ act: "add-post", title, _id, body: desc });
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

const confirmTheDelete = async (post: Post, deleteThePost: Dispatch) => {
  const confirmMsg = `Do you want to delete post: ${post.title}`;
  const body = { id: post._id };

  if (confirm(confirmMsg)) {
    await fetchPost("delete-post", body);
    deleteThePost({ act: "delete-post", post });
  }
};

const DeleteButton = ({ post, deleteThePost }) => (
  <>
    <button
      type="button"
      onClick={async () => {
        await confirmTheDelete(post, deleteThePost);
      }}
    >
      Delete
    </button>
    <hr />
  </>
);

const Feed = ({ post, deleteThePost }: FeedProps) => {
  return (
    <>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <DeleteButton post={post} deleteThePost={deleteThePost} />
    </>
  );
};

const CreateFeed = ({ posts, deleteThePost }: DeletePost) =>
  posts.map((post) => (
    <Feed post={post} key={post._id} deleteThePost={deleteThePost} />
  ));

const DisplayFeed = ({ posts, deleteThePost }: DeletePost) => (
  <div>
    <h1>Feed</h1>
    <CreateFeed posts={posts} deleteThePost={deleteThePost} />
  </div>
);

const App = () => {
  const [posts, dispatch] = useReducer(Reducer, []);

  useEffect(() => {
    fetch("http://localhost:8000/load-post")
      .then((x) => x.json())
      .then((x) => dispatch({ act: "", posts: x }));
  }, []);

  return (
    <div>
      <DisplayForm saveThePost={dispatch} posts={posts} />
      <DisplayFeed deleteThePost={dispatch} posts={posts} />
    </div>
  );
};

export default App;
