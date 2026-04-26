import { useState } from "react";
import { fetchPost } from "./Api.tsx";
import { type Action, type Post } from "./Reducer.ts";
import { type Dispatch } from "./App.tsx";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

type Res = { user: string; date: Date; id: string; userId: string };

type DisplayFormProps = {
  saveThePost: (action: Action) => void;
  posts: Post[];
};

const FormTitle = () => (
  <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
    Create Post
  </Typography>
);

const PostDescription = ({ setBody }) => (
  <TextField
    label="Body"
    name="body"
    placeholder="Write your post..."
    multiline
    rows={5}
    fullWidth
    onChange={(e) => setBody(e.target.value)}
  />
);

const PostTitle = ({ setTitle }) => (
  <TextField
    label="Title"
    type="text"
    name="title"
    placeholder="Enter a title..."
    required
    fullWidth
    onChange={(e) => setTitle(e.target.value)}
  />
);

const AddPost = async (
  e: React.FormEvent<HTMLFormElement>,
  title: string,
  desc: string,
  saveThePost: Dispatch,
) => {
  e.preventDefault();
  const body = { title, body: desc };

  const { id, user, date, userId }: Res = await fetchPost("add-post", body);
  saveThePost({ act: "add-post", _id: id, ...body, user, date, userId });
};

export const DisplayForm = ({ saveThePost }: DisplayFormProps) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <Paper
      component="form"
      sx={{ maxWidth: 700, mx: "auto", mt: 4, p: 3 }}
      onSubmit={async (e) => {
        await AddPost(e, title, body, saveThePost);
      }}
    >
      <Stack spacing={2}>
        <FormTitle />
        <PostTitle setTitle={setTitle} />
        <PostDescription setBody={setBody} />

        <Button type="submit" variant="contained">
          Post
        </Button>
      </Stack>
    </Paper>
  );
};
