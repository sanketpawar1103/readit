import { useState } from "react";

type Post = {
  title: string;
  body: string;
};

const FormTitle = () => <h1>Create Post</h1>;

const DisplayForm = ({ saveThePost, posts }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveThePost([{ title, body }, ...posts]);
      }}
    >
      <FormTitle />
      <p>Title</p>
      <input
        type="text"
        placeholder="Enter a title..."
        name="title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <p>Body</p>
      <textarea
        name="body"
        placeholder="Write your post..."
        rows={5}
        cols={50}
        onChange={(e) => setBody(e.target.value)}
      >
      </textarea>
      <button type="submit">Post</button>
    </form>
  );
};

const Feed = ({ post }) => {
  return (
    <>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
    </>
  );
};

const CreateFeed = ({ posts }) =>
  posts.map((p, i) => <Feed post={p} key={i} />);

const DisplayFeed = ({ posts }) => {
  return (
    <div>
      <h1>Feed</h1>
      <CreateFeed posts={posts} />
    </div>
  );
};

const App = () => {
  const dummyPosts: Post[] = [{ title: "sanket", body: "Step Intern" }];
  const [posts, setPosts] = useState(dummyPosts);

  return (
    <div>
      <DisplayForm saveThePost={setPosts} posts={posts} />
      <DisplayFeed posts={posts} />
    </div>
  );
};

export default App;
