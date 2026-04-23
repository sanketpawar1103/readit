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

  async addPost(title: string, body: string) {
    const date = Date.now();
    const user = "Sanket Pawar";
    const result = await this.#posts.insertOne({ title, body, user, date });

    return { id: result.insertedId.toString(), date, user };
  }

  async deletePost(id: string) {
    await this.#posts.deleteOne({ _id: new ObjectId(id) });

    return { id };
  }

  async loadPosts() {
    return (await this.#posts.find().toArray()).reverse();
  }
}
