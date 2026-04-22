export class PostStore {
  #nextId;
  #posts;

  constructor(posts) {
    this.#posts = posts;
    this.#nextId = 2;
  }

  addPost(title, body) {
    this.#posts.unshift({ title, body, id: this.#nextId++ });

    return this.#nextId - 1;
  }

  deletePost(id) {
    this.#posts = this.#posts.filter((post) => {
      return post.id !== Number(id);
    });

    return id;
  }

  loadPosts() {
    return this.#posts;
  }
}
