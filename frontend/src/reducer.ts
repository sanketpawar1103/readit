export type Post = {
  title: string;
  body: string;
  id: number;
};

export type Action =
  | { act: "add-post"; title: string; id: number; body: string }
  | { act: "delete-post"; post: Post };

export const Reducer = (posts: Post[], action: Action): Post[] => {
  switch (action.act) {
    case "add-post": {
      return [
        { title: action.title, body: action.body, id: action.id },
        ...posts,
      ];
    }

    case "delete-post":
      return posts.filter((p) => p.id !== action.post.id);

    default:
      return action.posts;
  }
};
