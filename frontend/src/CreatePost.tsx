import { useState } from "react";
import { type Action, type Post } from "./Reducer.ts";
import { type Dispatch } from "./App.tsx";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import AttachFileIcon from "@mui/icons-material/AttachFile";

type Res = {
  user: string;
  date: Date;
  id: string;
  userId: string;
  currentUser: string;
  image?: string;
};

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

const ImagePicker = ({ setImage }) => (
  <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
    <IconButton component="label">
      <AttachFileIcon />
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          setImage(file);
        }}
      />
    </IconButton>

    <Typography variant="body2">Attach image</Typography>
  </Stack>
);

const AddPost = async (
  e: React.FormEvent<HTMLFormElement>,
  title: string,
  desc: string,
  img: File | null,
  saveThePost: Dispatch,
) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", title);
  formData.append("body", desc);

  if (img) formData.append("image", img);

  await fetch("http://localhost:8000/add-post", {
    method: "POST",
    body: formData,
    credentials: "include",
  })
    .then((res) => res.json())
    .then(({ id, user, date, userId, currentUser, image }: Res) =>
      saveThePost({
        act: "add-post",
        _id: id,
        title,
        body: desc,
        user,
        date,
        userId,
        currentUser,
        image,
      })
    );
};

export const DisplayForm = ({ saveThePost }: DisplayFormProps) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);

  return (
    <Paper
      component="form"
      sx={{ maxWidth: 700, mx: "auto", mt: 4, p: 3 }}
      onSubmit={async (e) => {
        await AddPost(e, title, body, image, saveThePost);
        setTitle("");
        setBody("");
        setImage(null);
      }}
    >
      <Stack spacing={2}>
        <FormTitle />
        <PostTitle setTitle={setTitle} />
        <PostDescription setBody={setBody} />
        <ImagePicker setImage={setImage} />

        <Button type="submit" variant="contained">
          Post
        </Button>
      </Stack>
    </Paper>
  );
};
