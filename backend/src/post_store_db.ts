import { Db } from "mongodb";

export class PostStoreDB {
  #posts;

  constructor(db: Db) {
    this.#posts = db.collection("posts");
  }

  async addPost(title: string, body: string) {
    const result = await this.#posts.insertOne({ title, body });

    return result.insertedId.toString();
  }

  async loadPosts() {
    return await this.#posts.find().toArray();
  }
}
