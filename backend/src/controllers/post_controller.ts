import { Context } from "hono";
import cloudinary from "../config/cloudinary.ts";
import { getUserIdFromToken } from "./authentication_controller.ts";
import { userIdDecode } from "./user_controller.ts";

type ImageUrl = { imageUrl: string };

export const loadPosts = async (c: Context) => {
  const instance = c.get("store");
  const { userId } = getUserIdFromToken(c);
  const posts = await instance.loadPosts(userId);
  posts.currentUser = userId;

  return c.json(posts);
};

const uploadImage = async (image?: File) => {
  if (!image) return { imageUrl: "" };

  const bytes = new Uint8Array(await image.arrayBuffer());

  const result = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "readit-posts" }, (error, result) => {
          if (error || !result) return reject(error);

          resolve({ secure_url: result.secure_url });
        })
        .end(bytes);
    },
  );

  return { imageUrl: result.secure_url };
};

export const addPost = async (c: Context) => {
  const { userId }: userIdDecode = getUserIdFromToken(c);
  const instance = c.get("store");
  const formData = await c.req.parseBody();

  const title = formData.title as string;
  const body = formData.body as string;
  const image = formData.image as File | undefined;

  const { imageUrl }: ImageUrl = await uploadImage(image);

  const postDetails = await instance.addPost(title, body, userId, imageUrl);
  postDetails.currentUser = userId;

  return c.json(postDetails);
};

export const deletePost = async (c: Context) => {
  const { userId }: userIdDecode = getUserIdFromToken(c);
  const instance = c.get("store");

  const { id } = await c.req.json();
  const { deletedId } = await instance.deletePost(id, userId);

  return c.json({ deletedId });
};

export const toggleLike = async (c: Context) => {
  const { userId }: userIdDecode = getUserIdFromToken(c);
  const instance = c.get("store");
  const { postId } = await c.req.json();

  const likeCount = await instance.toggleLike(postId, userId);
  return c.json(likeCount);
};
