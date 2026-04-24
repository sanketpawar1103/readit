import { format } from "date-fns";

export type Post = {
  title: string;
  body: string;
  _id: string;
  user: string;
  date: string;
};

export type Action =
  | {
    act: "add-post";
    title: string;
    _id: string;
    body: string;
    user: string;
    date: Date;
  }
  | { act: "delete-post"; post: Post }
  | { act: ""; posts: Post[] }
  | { act: "render-posts"; posts: Post[] };

export const Reducer = (posts: Post[] | [], action: Action): Post[] => {
  switch (action.act) {
    case "add-post": {
      const newPost = {
        title: action.title,
        body: action.body,
        _id: action._id,
        date: format(action.date, "MM/dd/yyyy"),
        user: action.user,
      };

      return [newPost, ...posts];
    }

    case "delete-post": {
      const result = posts.filter(({ _id }) => _id !== action.post._id);
      return result;
    }

    case "render-posts": {
      return [...posts, ...action.posts];
    }

    default: {
      return action.posts;
    }
  }
};
