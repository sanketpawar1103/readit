import { Context } from "hono";
import { getUserIdFromToken } from "./authentication_controller.ts";

export type userIdDecode = { userId: string };

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

  const { userId }: userIdDecode = getUserIdFromToken(c);
  const subscriptionList = await instance.getUserData(userId);
  const result = mapSubscribers(subscriptionList.subscribed, match.matches);

  return c.json(result);
};

export const toggleSubscribe = async (c: Context) => {
  const instance = c.get("store");
  const { id } = await c.req.json();

  const { userId }: userIdDecode = getUserIdFromToken(c);
  const posts = await instance.toggleSubscribe(id, userId);

  return c.json(posts);
};
