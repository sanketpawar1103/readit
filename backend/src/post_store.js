export class PostStore {
  #nextId;
  #posts;

  constructor(posts) {
    this.#posts = posts;
    this.#nextId = 1;
  }

  addPost(title, body) {
    this.#posts.push({ title, body, id: this.#nextId++ });

    return this.#nextId - 1;
  }

  deletePost(id) {
    this.#posts.filter((post) => post.id !== id);

    return id;
  }

  loadPosts() {
    return this.#posts;
  }
}
