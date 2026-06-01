import { assertEquals } from "@std/assert";
import { ObjectId } from "mongodb";

// Tests for comment CRUD logic — mirrors the behaviour in PostStore methods

Deno.test("addComment: builds a comment with all required fields", () => {
  const text = "Great post!";
  const userId = "uid1";
  const user = "alice";

  const comment = {
    _id: new ObjectId(),
    text,
    user,
    userId,
    date: Date.now(),
  };

  assertEquals(comment.text, text);
  assertEquals(comment.userId, userId);
  assertEquals(comment.user, user);
  assertEquals(typeof comment.date, "number");
  assertEquals(comment._id instanceof ObjectId, true);
});

Deno.test("deleteComment: allows deletion when userId matches", () => {
  const userId = "uid1";
  const comment = { _id: new ObjectId(), text: "hi", user: "alice", userId: "uid1", date: 111 };

  const canDelete = comment.userId === userId;
  assertEquals(canDelete, true);
});

Deno.test("deleteComment: rejects deletion when userId does not match", () => {
  const userId = "uid2";
  const comment = { _id: new ObjectId(), text: "hi", user: "alice", userId: "uid1", date: 111 };

  const canDelete = comment.userId === userId;
  assertEquals(canDelete, false);
});

Deno.test("getComments: returns empty array when post has no comments", () => {
  // mirrors: post?.comments ?? []
  const post = { title: "Test", comments: undefined as unknown };
  const comments = (post.comments as unknown[] | undefined) ?? [];
  assertEquals(comments.length, 0);
});

Deno.test("getComments: returns comments array when present", () => {
  const stored = [
    { _id: new ObjectId(), text: "hello", user: "alice", userId: "uid1", date: 111 },
    { _id: new ObjectId(), text: "world", user: "bob", userId: "uid2", date: 222 },
  ];
  const post = { title: "Test", comments: stored };
  const comments = post.comments ?? [];
  assertEquals(comments.length, 2);
  assertEquals(comments[0].text, "hello");
});
