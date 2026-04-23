import { Db, ObjectId } from "mongodb";

export class PostStoreDB {
  #posts;

  constructor(db: Db) {
    this.#posts = db.collection("posts");
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
