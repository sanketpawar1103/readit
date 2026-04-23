import { useState } from "react";
import { fetchPost } from "./Api.tsx";
import { type Action, type Post } from "./Reducer.ts";
import { type Dispatch } from "./App.tsx";

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
  e: React.FormEvent<HTMLFormElement>,
  title: string,
  desc: string,
  saveThePost: Dispatch,
) => {
  e.preventDefault();
  const body = { title, body: desc };

  const { id, user, date }: Res = await fetchPost("add-post", body);
  saveThePost({ act: "add-post", _id: id, ...body, user, date });
};

export const DisplayForm = ({ saveThePost }: DisplayFormProps) => {
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
