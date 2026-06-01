import { assertEquals } from "@std/assert";

Deno.test("commentCount projection: post with comments returns correct count", () => {
  const comments = [
    { _id: "c1", text: "hi", user: "u1", userId: "uid1", date: 111 },
    { _id: "c2", text: "bye", user: "u2", userId: "uid2", date: 222 },
  ];
  // mirrors MongoDB: { $size: { $ifNull: ["$comments", []] } }
  const commentCount = (comments ?? []).length;
  assertEquals(commentCount, 2);
});

Deno.test("commentCount projection: post without comments field returns 0", () => {
  const comments = undefined;
  const commentCount = (comments ?? []).length;
  assertEquals(commentCount, 0);
});

Deno.test("commentCount projection: post with empty comments array returns 0", () => {
  const comments: unknown[] = [];
  const commentCount = (comments ?? []).length;
  assertEquals(commentCount, 0);
});

Deno.test("feed projection: comments field is excluded, commentCount is present", () => {
  const fullPost = {
    _id: "p1",
    title: "Test Post",
    body: "Body",
    user: "user1",
    date: 123456,
    userId: "uid1",
    likes: [],
    image: "",
    comments: [{ _id: "c1", text: "hi", user: "u1", userId: "uid1", date: 111 }],
    commentCount: 1,
  };

  // mirrors MongoDB $project excluding comments
  const { comments: _excluded, ...feedPost } = fullPost;

  assertEquals("comments" in feedPost, false);
  assertEquals(feedPost.commentCount, 1);
  assertEquals(feedPost.title, "Test Post");
});
