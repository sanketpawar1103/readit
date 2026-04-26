import { Collection, Db, ObjectId } from "mongodb";

type Credentials = {
  userName: string;
  password: string;
};

type User = {
  _id?: ObjectId;
  user: string;
  password: string;
  subscribed: string[];
};

type Post = {
  _id?: ObjectId;
  title: string;
  body: string;
  user: string;
  date: number;
  userId: string;
  likes: string[];
};

export class PostStoreDB {
  #posts: Collection<Post>;
  #users: Collection<User>;

  constructor(db: Db) {
    this.#posts = db.collection<Post>("posts");
    this.#users = db.collection<User>("users");
  }

  async loginUser({ userName, password }: Credentials) {
    const [isExist] = await this.#users
      .find({ user: userName, password: password })
      .toArray();

    if (isExist !== undefined) return { userId: isExist._id.toString() };

    const result = await this.#users.insertOne({
      user: userName,
      password: password,
      subscribed: [],
    });

    return { userId: result.insertedId.toString() };
  }

  async getUserData(userId: string) {
    const [result] = await this.#users
      .find({ _id: new ObjectId(userId) })
      .toArray();

    return result;
  }

  async addPost(title: string, body: string, userId: string) {
    const { user } = await this.getUserData(userId);
    const date = Date.now();
    const likes: string[] = [];
    const row = { title, body, user, date, userId, likes };
    const result = await this.#posts.insertOne(row);

    return { id: result.insertedId.toString(), date, user, userId, likes };
  }

  async deletePost(id: string, userId: string) {
    await this.#posts.deleteOne({ _id: new ObjectId(id), userId });

    return { id };
  }

  async #getAllPostsOfUser(userId: string) {
    return (await this.#posts.find({ userId: userId }).toArray()).reverse();
  }

  async loadPosts(userId: string) {
    const usersPost = await this.#getAllPostsOfUser(userId);
    const { subscribed } = await this.getUserData(userId);
    const otherPosts = await Promise.all(
      subscribed.map((id: string) => this.#getAllPostsOfUser(id)),
    );

    return { usersPost: [...usersPost, ...otherPosts.flat(2)] };
  }

  async searchUsers(initials: string) {
    const matches = await this.#users
      .find({ user: { $regex: "^" + initials, $options: "i" } })
      .toArray();

    return {
      matches: matches.map(({ _id, user, subscribed }) => {
        return { _id: _id.toString(), user, subscribed };
      }),
    };
  }

  async toggleSubscribe(id: string, userId: string) {
    const { subscribed } = await this.getUserData(userId);
    if (!subscribed.includes(id)) {
      await this.#addToSubscribe(subscribed, id, userId);

      return { posts: await this.#posts.find({ userId: id }).toArray() };
    }

    await this.#unsubscribeUser(userId, id);

    return { id };
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

  async #unsubscribeUser(userId: string, id: string) {
    await this.#users.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { subscribed: id } },
    );
  }

  async #dislikePost(postId: string, userId: string) {
    await this.#posts.updateOne(
      { _id: new ObjectId(postId) },
      { $pull: { likes: userId } },
    );
  }

  async #addToSubscribe(subscribed: string[], id: string, userId: string) {
    subscribed.push(id);

    await this.#users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { subscribed: subscribed } },
    );
  }

  async #addToLike(likes: string[], postId: string, userId: string) {
    likes.push(userId);

    await this.#posts.updateOne(
      { _id: new ObjectId(postId) },
      { $set: { likes: likes } },
    );
  }
}
