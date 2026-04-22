import { Db, ObjectId } from "mongodb";

export class PostStoreDB {
  #posts;

  constructor(db: Db) {
    this.#posts = db.collection("posts");
  }

  async addPost(title: string, body: string) {
    const result = await this.#posts.insertOne({ title, body });

    return result.insertedId.toString();
  }

  async deletePost(id: string) {
    await this.#posts.deleteOne({ _id: new ObjectId(id) });

    return id;
  }

  async loadPosts() {
    return await this.#posts.find().toArray();
  }
}
