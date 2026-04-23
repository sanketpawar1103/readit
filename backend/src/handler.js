export const loadPosts = async (c) => {
  const instance = c.get("store");
  const some = await instance.loadPosts();

  return c.json(some);
};

export const addPost = async (c) => {
  const instance = c.get("store");
  const { title, body } = await c.req.json();
  const postDetails = await instance.addPost(title, body);

  return c.json(postDetails);
};

export const deletePost = async (c) => {
  const instance = c.get("store");
  const { id } = await c.req.json();
  const { deletedId } = await instance.deletePost(id);

  return c.json({ deletedId });
};

export const loginUser = async (c) => {
  const { userName, password } = await c.req.json();
  console.log({ userName, password });

  return c.json({ success: true });
};
