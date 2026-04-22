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
      const id = posts[posts.length - 1].id + 1 || 1;
      return [{ title: action.title, body: action.body, id }, ...posts];
    }

    case "delete-post":
      return posts.filter((p) => p.id !== action.post.id);

    default:
      return posts;
  }
};
