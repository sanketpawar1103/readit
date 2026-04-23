import { Db, ObjectId } from "mongodb";

type Credentials = {
  userName: string;
  password: string;
};

export class PostStoreDB {
  #posts;
  #users;

  constructor(db: Db) {
    this.#posts = db.collection("posts");
    this.#users = db.collection("users");
  }

  async loginUser({ userName, password }: Credentials) {
    const [isExist] = await this.#users
      .find({ user: userName, password: password })
      .toArray();

    if (isExist !== undefined) {
      return { id: isExist._id };
    }

    const result = await this.#users.insertOne({
      user: userName,
      password: password,
    });

    return { id: result.insertedId.toString() };
  }

  async #getUserData(userId: string) {
    const [result] = await this.#users
      .find({ _id: new ObjectId(userId) })
      .toArray();

    return result;
  }

  async addPost(title: string, body: string, userId: string) {
    const { user } = await this.#getUserData(userId);
    const date = Date.now();
    const row = { title, body, user, date, userId };
    const result = await this.#posts.insertOne(row);

    return { id: result.insertedId.toString(), date, user };
  }

  async deletePost(id: string, userId: string) {
    await this.#posts.deleteOne({ _id: new ObjectId(id), userId });

    return { id };
  }

  async #getAllPostsOfUser(userId: string) {
    return (await this.#posts.find({ userId: userId }).toArray()).reverse();
  }

  async loadPosts(userId: string) {
    return await this.#getAllPostsOfUser(userId);
  }
}

// const pids = (await this.#posts.find().toArray()).map((_id) => _id);
// const uids = (await this.#users.find().toArray()).map((_id) => _id);
// console.log({ pids, uids });
// pids.map(
//   async ({ _id }) =>
//     await this.#posts.deleteOne({ _id: new ObjectId(_id) }),
// );
// uids.map(
//   async ({ _id }) =>
//     await this.#users.deleteOne({ _id: new ObjectId(_id) }),
// );
// const p = (await this.#posts.find().toArray()).map((_id) => _id);
// const u = (await this.#users.find().toArray()).map((_id) => _id);
// console.log({ p, u });
