import { useState } from "react";

const FormTitle = () => <h1>Create Post</h1>;

const FormData = () => (
  <>
    <p>Title</p>
    <input type="text" placeholder="Enter a title..." name="title" />
    <p>Body</p>
    <textarea
      name="body"
      placeholder="Write your post..."
      rows={5}
      cols={50}
    >
    </textarea>
    <button type="submit">Post</button>
  </>
);

const DisplayForm = ({ saveThePost, posts }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      saveThePost([...posts, { name: "sanket", body: "StepIntern" }]);
    }}
  >
    <FormTitle />
    <FormData />
  </form>
);

const Feed = ({ post }: { name: string; body: string }) => {
  return (
    <>
      <h2>{post.name}</h2>
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
  const dummyPosts = [{ name: "sanket", body: "Step Intern" }];
  const [posts, setPosts] = useState(dummyPosts);

  return (
    <div>
      <DisplayForm saveThePost={setPosts} posts={posts} />
      <DisplayFeed posts={posts} />
    </div>
  );
};

export default App;
