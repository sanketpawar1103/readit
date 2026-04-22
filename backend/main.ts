import { Post } from "../frontend/src/reducer.ts";
import { createApp } from "./src/app.ts";
import { PostStore } from "./src/post_store.js";

const main = () => {
  const posts: Post[] = [{ title: "sanket", body: "Step Intern", id: 1 }];

  const store = new PostStore(posts);
  const app = createApp(store);
  Deno.serve({ port: 8000 }, app.fetch);
};

main();
