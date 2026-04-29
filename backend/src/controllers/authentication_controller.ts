import { getCookie, setCookie } from "hono/cookie";
import { Context } from "hono";
import jwt from "jsonwebtoken";

const SECRET = Deno.env.get("JWT_SECRET")!;

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

export const getUserIdFromToken = (c: Context) => {
  const token = getCookie(c, "token");
  if (!token) throw new Error("Unauthorized User Access");

  return jwt.verify(token, SECRET);
};

export const loginUser = async (c: Context) => {
  const instance = c.get("store");
  const credentials = await c.req.json();
  const { userId } = await instance.loginUser(credentials);

  const token = jwt.sign({ userId }, SECRET);

  setCookie(c, "token", token, {
    httpOnly: true,
    sameSite: "None",
    path: "/",
    secure: true,
    domain: "localhost",
  });

  return c.json({ success: true });
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
  const token = getCookie(c, "token");
  const response = !token ? { success: false } : { success: true };

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

  const token = jwt.sign({ userId: res.userId }, SECRET);

  setCookie(c, "token", token, {
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
