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
  | { act: ""; posts: Post[] };

export const Reducer = (posts: Post[] | [], action: Action): Post[] => {
  switch (action.act) {
    case "add-post": {
      console.log("Adds the post");

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
      console.log("deletes the post");
      const result = posts.filter(({ _id }) => _id !== action.post._id);
      console.log(posts.map(console.log).length);
      console.log(result.map(console.log).length);
      return result;
    }
    default: {
      console.log("calls fetch");
      return action.posts;
    }
  }
};
