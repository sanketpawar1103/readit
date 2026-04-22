import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { addPost, deletePost, loadPosts } from "./handler.js";

export const createApp = (store) => {
  const app = new Hono();
  app.use((c, next) => {
    c.set("store", store);
    return next();
  });

  app.use(logger());
  app.use(cors({ origin: "http://localhost:5173" }));
  app.get("/load-post", loadPosts);
  app.post("/add-post", addPost);
  app.post("/delete-post", deletePost);

  return app;
};
