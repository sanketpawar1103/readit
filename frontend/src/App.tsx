import { useState } from "react";

const FormTitle = () => <h1>Create Post</h1>;

const FormData = () => (
  <div>
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
  </div>
);

const DisplayForm = () => (
  <form>
    <FormTitle />
    <FormData />
  </form>
);

// const DisplayForm = () => {
//   return (
//     <div>
//       <h1>Create Post</h1>
//       <CreatePostForm />
//     </div>
//   );
// };

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <DisplayForm />
    </div>
  );
};

export default App;
