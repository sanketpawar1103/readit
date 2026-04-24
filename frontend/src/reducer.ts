import { format } from "date-fns";

export type Post = {
  title: string;
  body: string;
  _id: string;
  user: string;
  date: string;
  userId: string;
};

export type Action =
  | {
    act: "add-post";
    title: string;
    _id: string;
    body: string;
    user: string;
    date: Date;
    userId: string;
  }
  | { act: "delete-post"; post: Post }
  | { act: ""; posts: Post[] }
  | { act: "render-posts"; posts: Post[] }
  | { act: "delete-posts"; id: string };

export const Reducer = (posts: Post[] | [], action: Action): Post[] => {
  switch (action.act) {
    case "add-post": {
      const newPost = {
        title: action.title,
        body: action.body,
        _id: action._id,
        date: format(action.date, "MM/dd/yyyy"),
        user: action.user,
        userId: action.userId,
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
    case "delete-posts": {
      const delPosts = posts.filter(({ userId }) => {
        return userId !== action.id;
      });

      return [...delPosts];
    }

    default: {
      return action.posts;
    }
  }
};
