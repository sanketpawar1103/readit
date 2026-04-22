export class PostStore {
  #nextId;
  #posts;

  constructor(posts) {
    this.#posts = posts;
    this.#nextId = 2;
  }

  addPost(title, body) {
    this.#posts.unshift({ title, body, id: this.#nextId++ });
    console.log({ posts: this.#posts });

    console.log(this.#posts[0].id);
    return this.#nextId - 1;
  }

  deletePost(id) {
    this.#posts.filter((post) => post.id !== id);
    console.log({ posts: this.#posts });

    return id;
  }

  loadPosts() {
    console.log({ posts: this.#posts });

    return this.#posts;
  }
}
