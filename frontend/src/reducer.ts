import { format } from "date-fns";

export type Post = {
  title: string;
  body: string;
  id: string;
  user: string;
  date: string;
};

export type Action =
  | {
    act: "add-post";
    title: string;
    id: string;
    body: string;
    user: string;
    date: Date;
  }
  | { act: "delete-post"; post: Post }
  | { act: ""; posts: Post[] };

export const Reducer = (posts: Post[] | [], action: Action): Post[] => {
  switch (action.act) {
    case "add-post": {
      const newPost = {
        title: action.title,
        body: action.body,
        id: action.id,
        date: format(action.date, "MM/dd/yyyy"),
        user: action.user,
      };

      return [newPost, ...posts];
    }

    case "delete-post":
      return posts.filter(({ id }) => id !== action.post.id);

    default:
      return action.posts;
  }
};
