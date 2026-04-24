import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import {
  addPost,
  deletePost,
  loadPosts,
  loginUser,
  searchUsers,
  toggleSubscribe,
} from "./handler.ts";
import { PostStoreDB } from "./post_store_db.ts";

type AppVariables = {
  store: PostStoreDB;
};

export const createApp = (store: PostStoreDB) => {
  const app = new Hono<{ Variables: AppVariables }>();
  app.use((c, next) => {
    c.set("store", store);
    return next();
  });

  app.use(logger());
  app.use(cors({ origin: ["http://127.0.0.1:5173"], credentials: true }));
  app.get("/load-post", loadPosts);
  app.post("/login", loginUser);
  app.post("/add-post", addPost);
  app.post("/delete-post", deletePost);
  app.post("/search-users", searchUsers);
  app.post("/toggle-subscribe", toggleSubscribe);

  return app;
};
