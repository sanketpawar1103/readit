import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import {
  addPost,
  addComment,
  deleteComment,
  deletePost,
  loadComments,
  loadPosts,
  toggleLike,
} from "./controllers/post_controller.ts";

import { searchUsers, toggleSubscribe } from "./controllers/user_controller.ts";

import {
  authWithGit,
  getUserDataAfterAuth,
  gitCallbackHandler,
  loginUser,
} from "./controllers/authentication_controller.ts";
import { PostStore } from "./modules/post_store_db.ts";

type AppVariables = {
  store: PostStore;
};

export const createApp = (store: PostStore) => {
  const app = new Hono<{ Variables: AppVariables }>();
  app.use((c, next) => {
    c.set("store", store);
    return next();
  });

  app.use(logger());
  app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
  app.get("/load-post", loadPosts);

  app.get("/get-user-data", getUserDataAfterAuth);
  app.post("/login", loginUser);
  app.post("/add-post", addPost);
  app.post("/delete-post", deletePost);
  app.post("/search-users", searchUsers);
  app.post("/toggle-subscribe", toggleSubscribe);
  app.post("/toggle-like", toggleLike);
  app.get("/auth-with-git", authWithGit);
  app.get("/callback", gitCallbackHandler);
  app.get("/load-comments", loadComments);
  app.post("/add-comment", addComment);
  app.post("/delete-comment", deleteComment);

  return app;
};
