import { getCookie, setCookie } from "hono/cookie";
import { Context } from "hono";

export const loadPosts = async (c: Context) => {
  const instance = c.get("store");
  const userId = getCookie(c, "userId");
  const some = await instance.loadPosts(userId);

  return c.json(some);
};

export const addPost = async (c: Context) => {
  const userId = getCookie(c, "userId");
  const instance = c.get("store");
  const { title, body } = await c.req.json();
  const postDetails = await instance.addPost(title, body, userId);

  return c.json(postDetails);
};

export const deletePost = async (c: Context) => {
  const instance = c.get("store");
  const userId = getCookie(c, "userId");
  const { id } = await c.req.json();
  const { deletedId } = await instance.deletePost(id, userId);

  return c.json({ deletedId });
};

export const loginUser = async (c: Context) => {
  const instance = c.get("store");
  const credentials = await c.req.json();

  const { id } = await instance.loginUser(credentials);
  setCookie(c, "userId", id, {
    httpOnly: true,
    sameSite: "None",
    path: "/",
    secure: true,
    domain: "localhost",
  });

  return c.json({ success: true });
};
