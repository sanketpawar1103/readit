export const loadPosts = (c) => {
  const instance = c.get("store");

  return c.json(instance.loadPosts());
};

export const addPost = async (c) => {
  const instance = c.get("store");
  const { title, body } = await c.req.json();
  const id = instance.addPost(title, body);

  return c.json(id);
};

export const deletePost = async (c) => {
  const instance = c.get("store");
  const { id } = await c.req.json();

  return c.json(instance.deletePost(id));
};
