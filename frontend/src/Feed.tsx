import { format } from "date-fns/format";
import { useNavigate } from "react-router-dom";
import { type Dispatch } from "./App.tsx";
import { fetchPost } from "./Api.tsx";
import type { Action, Post } from "./Reducer.ts";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";

type DeletePost = {
  posts: Post[];
  deleteThePost: (action: Action) => void;
};

type FeedProps = {
  post: Post;
  deleteThePost: (action: Action) => void;
};

const PostImage = ({ image }: { image?: string }) =>
  !image ? null : (
    <img
      src={image}
      alt="Post image"
      style={{
        width: "100%",
        maxHeight: "400px",
        objectFit: "contain",
        marginTop: "16px",
        borderRadius: "8px",
      }}
    />
  );

const confirmTheDelete = async (post: Post, deleteThePost: Dispatch) => {
  const confirmMsg = `Do you want to delete post: ${post.title}`;
  const body = { id: post._id };

  if (confirm(confirmMsg)) {
    await fetchPost("delete-post", body);
    deleteThePost({ act: "delete-post", post });
  }
};

const DeleteBtn = ({ post, deleteThePost }) => (
  <Button
    type="button"
    variant="outlined"
    color="error"
    onClick={async () => {
      await confirmTheDelete(post, deleteThePost);
    }}
  >
    Delete
  </Button>
);

const LikeBtn = ({ post }) => (
  <Button
    type="button"
    variant="contained"
    onClick={(e) => {
      fetchPost("toggle-like", { postId: post._id }).then((res) => {
        (e.target as HTMLButtonElement).innerText = `Likes ${res.likes.length}`;
      });
    }}
  >
    Likes {post.likes.length}
  </Button>
);

const CommentBtn = ({ post }: { post: Post }) => {
  const navigate = useNavigate();
  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
      <IconButton
        size="small"
        onClick={() => navigate(`/post/${post._id}/comments`)}
        aria-label="view comments"
      >
        <ChatBubbleOutlineIcon fontSize="small" />
      </IconButton>
      <Typography variant="body2">{post.commentCount ?? 0}</Typography>
    </Stack>
  );
};

const Actions = ({ post, deleteThePost }: FeedProps) => (
  <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: "center" }}>
    <LikeBtn post={post} />
    <CommentBtn post={post} />
    {post.currentUser === post.userId
      ? <DeleteBtn deleteThePost={deleteThePost} post={post} />
      : (
        ""
      )}
  </Stack>
);

export const Feed = ({ post, deleteThePost }: FeedProps) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        {post.user}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {format(new Date(post.date), "MMM d, yyyy • hh:mm a")}
      </Typography>

      <Typography variant="h5" sx={{ mt: 2 }}>
        Title - {post.title}
      </Typography>

      <Typography variant="body1" sx={{ mt: 1 }}>
        Description - {post.body}
      </Typography>

      <PostImage image={post.image} />

      <Actions post={post} deleteThePost={deleteThePost} />
    </CardContent>
  </Card>
);

const CreateFeed = ({ posts, deleteThePost }: DeletePost) =>
  posts.map((post, i) => (
    <Feed post={post} key={i} deleteThePost={deleteThePost} />
  ));

export const DisplayFeed = ({ posts, deleteThePost }: DeletePost) => (
  <Stack sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
      Feed
    </Typography>

    <Divider sx={{ mb: 3 }} />

    <CreateFeed posts={posts} deleteThePost={deleteThePost} />
  </Stack>
);
