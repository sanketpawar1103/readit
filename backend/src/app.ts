import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { addPost, deletePost, loadPosts } from "./handler.js";
import { PostStoreDB } from "./post_store_db.ts";

export const createApp = (store: PostStoreDB) => {
  const app = new Hono();
  app.use((c, next) => {
    c.set("store", store);
    return next();
  });

  app.use(logger());
  app.use(cors({ origin: "http://127.0.0.1:5173" }));
  app.get("/load-post", loadPosts);
  app.post("/add-post", addPost);
  app.post("/delete-post", deletePost);

  return app;
};
