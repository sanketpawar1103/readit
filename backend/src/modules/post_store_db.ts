import { Collection, Db, ObjectId } from "mongodb";
import { Credentials, UserStore } from "./user_store_db.ts";

type Post = {
  _id?: ObjectId;
  title: string;
  body: string;
  user: string;
  date: number;
  userId: string;
  likes: string[];
};

export class PostStore {
  #posts: Collection<Post>;
  #users: UserStore;

  constructor(db: Db, userInstance: UserStore) {
    this.#posts = db.collection<Post>("posts");
    this.#users = userInstance;
  }

  async loginUser(credentials: Credentials) {
    return await this.#users.loginUser(credentials);
  }

  async getUserData(userId: string) {
    return await this.#users.getUserData(userId);
  }

  async deletePost(id: string, userId: string) {
    await this.#posts.deleteOne({ _id: new ObjectId(id), userId });

    return { id };
  }

  async getAllPostsOfUser(userId: string) {
    return (await this.#posts.find({ userId: userId }).toArray()).reverse();
  }

  async addPost(title: string, body: string, userId: string, image?: File) {
    const { user } = await this.#users.getUserData(userId);
    const date = Date.now();
    const likes: string[] = [];
    const row = { title, body, user, date, userId, likes, image };
    const result = await this.#posts.insertOne(row);
    const id = result.insertedId.toString();

    return { id, date, user, userId, likes, image };
  }
  async loadPosts(userId: string) {
    const usersPost = await this.getAllPostsOfUser(userId);
    const { subscribed } = await this.#users.getUserData(userId);
    const otherPosts = await Promise.all(
      subscribed.map((id: string) => this.getAllPostsOfUser(id)),
    );
    const res = [...usersPost, ...otherPosts.flat(2)].filter((p) => p);

    return { usersPost: res };
  }

  async toggleLike(postId: string, userId: string) {
    const [{ likes: postLikes }] = await this.#posts
      .find({ _id: new ObjectId(postId) })
      .toArray();

    if (!postLikes.includes(userId)) {
      await this.#addToLike(postLikes, postId, userId);
    } else {
      await this.#dislikePost(postId, userId);
    }

    const [{ likes }] = await this.#posts
      .find({ _id: new ObjectId(postId) })
      .toArray();

    return { likes };
  }

  async #dislikePost(postId: string, userId: string) {
    await this.#posts.updateOne(
      { _id: new ObjectId(postId) },
      { $pull: { likes: userId } },
    );
  }

  async #addToLike(likes: string[], postId: string, userId: string) {
    likes.push(userId);

    await this.#posts.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { likes: likes } },
    );
  }

  async #unsubscribeUser(userId: string, id: string) {
    await this.#users.unSubscribe(userId, id);
  }

  async #addToSubscribe(subscribed: string[], id: string, userId: string) {
    await this.#users.subscribe(subscribed, id, userId);
  }

  async toggleSubscribe(id: string, userId: string) {
    const { subscribed } = await this.#users.getUserData(userId);

    if (!subscribed.includes(id)) {
      await this.#addToSubscribe(subscribed, id, userId);

      return { posts: await this.getAllPostsOfUser(id) };
    }

    await this.#unsubscribeUser(userId, id);

    return { id };
  }

  async searchUsers(initials: string) {
    return await this.#users.searchUsers(initials);
  }
}
