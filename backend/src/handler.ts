import { getCookie, setCookie } from "hono/cookie";
import { Context } from "hono";

const APIS = {
  auth: "https://github.com/login/oauth/authorize",
  accessToken: "https://github.com/login/oauth/access_token",
  userInfo: `https://api.github.com/user`,
  appPage: "http://localhost:5173/",
};

type AccessData = {
  access_token: string;
  token_type: string;
  scope: string;
};

export const loadPosts = async (c: Context) => {
  const instance = c.get("store");
  const userId = getCookie(c, "userId");
  const some = await instance.loadPosts(userId);
  some.currentUser = userId;

  return c.json(some);
};

export const addPost = async (c: Context) => {
  const userId = getCookie(c, "userId");
  const instance = c.get("store");
  const formData = await c.req.parseBody();
  const title = formData.title as string;
  const body = formData.body as string;
  const image = formData.image as File | undefined;

  const postDetails = await instance.addPost(title, body, userId, image);

  postDetails.currentUser = userId;

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
  const { userId } = await instance.loginUser(credentials);

  setCookie(c, "userId", userId, {
    httpOnly: true,
    sameSite: "None",
    path: "/",
    secure: true,
    domain: "localhost",
  });

  return c.json({ success: true });
};

type Matches = {
  _id: string;
  user: string;
  password: string;
  subscribed: string[];
};

const mapSubscribers = (subscriptionList: string[], matches: Matches[]) => {
  return matches.map(({ _id, user }) => ({
    user,
    _id,
    isSubscribed: subscriptionList.includes(_id),
  }));
};

export const searchUsers = async (c: Context) => {
  const instance = c.get("store");
  const { initials } = await c.req.json();
  const match = await instance.searchUsers(initials);
  const userId = getCookie(c, "userId");
  const subscriptionList = await instance.getUserData(userId);
  const result = mapSubscribers(subscriptionList.subscribed, match.matches);

  return c.json(result);
};

export const toggleSubscribe = async (c: Context) => {
  const instance = c.get("store");
  const { id } = await c.req.json();
  const userId = getCookie(c, "userId");
  const posts = await instance.toggleSubscribe(id, userId);

  return c.json(posts);
};

export const toggleLike = async (c: Context) => {
  const instance = c.get("store");
  const { postId } = await c.req.json();
  const userId = getCookie(c, "userId");

  const likeCount = await instance.toggleLike(postId, userId);
  return c.json(likeCount);
};

export const createBodyToAccessToken = (c: Context) => {
  const code = c.req.query("code");
  const client_id = "Ov23lioahzLfp98Kv3Xp";
  const client_secret = `d7c118e17547cf2a7269bc1c88864c61eb0da912`;

  return {
    client_id,
    code,
    client_secret,
  };
};

export const authWithGit = (c: Context) => {
  const CLIENT_ID = "Ov23lioahzLfp98Kv3Xp";
  const url = `${APIS.auth}?client_id=${CLIENT_ID}`;

  return c.redirect(url);
};

const getAccessToken = async (c: Context) =>
  await fetch(APIS.accessToken, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(createBodyToAccessToken(c)),
  }).then((res) => res.json());

export const getUserDataAfterAuth = (c: Context) => {
  const cookie = getCookie(c, "userId");
  const response = !cookie ? { success: false } : { success: true };

  return c.json(response);
};

const getUserDetailsFromGit = async (accessToken: AccessData) =>
  await fetch(APIS.userInfo, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken.access_token}`,
    },
  }).then((res) => res.json());

export const gitCallbackHandler = async (c: Context) => {
  const res = await getUserResFromGit(c);

  setCookie(c, "userId", res.userId, {
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
    secure: false,
  });
  return c.redirect(APIS.appPage);
};

const getUserResFromGit = async (c: Context) => {
  const accessToken: AccessData = await getAccessToken(c);
  const { login } = await getUserDetailsFromGit(accessToken);
  const instance = c.get("store");
  const res = await instance.loginUser({
    userName: login,
    password: "",
  });

  return res;
};
