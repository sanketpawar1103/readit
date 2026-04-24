import { format } from "date-fns/format";
import { type Dispatch } from "./App.tsx";
import { fetchPost } from "./Api.tsx";
import type { Action, Post } from "./Reducer.ts";

type Feed = {
  post: Post;
  posts: Post[];
  deleteThePost: (act: string, x: Post[]) => void;
};

type DeletePost = {
  posts: Post[];
  deleteThePost: (action: Action) => void;
};

type FeedProps = {
  post: Post;
  deleteThePost: (action: Action) => void;
};

const confirmTheDelete = async (post: Post, deleteThePost: Dispatch) => {
  const confirmMsg = `Do you want to delete post: ${post.title}`;
  const body = { id: post._id };

  if (confirm(confirmMsg)) {
    await fetchPost("delete-post", body);
    deleteThePost({ act: "delete-post", post });
  }
};

export const DeleteButton = ({ post, deleteThePost }) => (
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

export const Feed = ({ post, deleteThePost }: FeedProps) => {
  return post
    ? (
      <>
        <h2>{post.user}</h2>
        <p>
          {format(
            new Date(post.date || "1776964218892"),
            "MMM d, yyyy • hh:mm a",
          )}
        </p>
        <h1>{post.title}</h1>
        <p>{post.body}</p>
        <DeleteButton post={post} deleteThePost={deleteThePost} />
      </>
    )
    : <></>;
};

export const CreateFeed = ({ posts, deleteThePost }: DeletePost) => {
  console.log({ posts });
  return posts.map((post, i) => (
    <Feed post={post} key={i} deleteThePost={deleteThePost} />
  ));
};
export const DisplayFeed = ({ posts, deleteThePost }: DeletePost) => (
  <div>
    <h1>Feed</h1>
    <CreateFeed posts={posts} deleteThePost={deleteThePost} />
  </div>
);
