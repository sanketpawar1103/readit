export type Post = {
  title: string;
  body: string;
  _id: string;
};

export type Action =
  | { act: "add-post"; title: string; _id: string; body: string }
  | { act: "delete-post"; post: Post }
  | { act: ""; posts: Post[] };

export const Reducer = (posts: Post[] | [], action: Action): Post[] => {
  switch (action.act) {
    case "add-post": {
      return [
        { title: action.title, body: action.body, _id: action._id },
        ...posts,
      ];
    }

    case "delete-post":
      return posts.filter((p) => p._id !== action.post._id);

    default:
      return action.posts;
  }
};
