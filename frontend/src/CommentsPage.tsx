import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns/format";
import { fetchGet, fetchPost } from "./Api.tsx";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";

type Comment = {
  _id: string;
  text: string;
  user: string;
  userId: string;
  date: number;
};

const PageHeader = ({ onBack }: { onBack: () => void }) => (
  <>
    <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 2 }}>
      <IconButton onClick={onBack} aria-label="back to feed">
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h6">Comments</Typography>
    </Stack>
    <Divider sx={{ mb: 3 }} />
  </>
);

const CommentDeleteBtn = ({ onDelete }: { onDelete: () => void }) => (
  <IconButton size="small" color="error" onClick={onDelete} aria-label="delete comment">
    <DeleteOutlineIcon fontSize="small" />
  </IconButton>
);

const CommentCard = (
  { comment, currentUser, onDelete }: {
    comment: Comment;
    currentUser: string;
    onDelete: (id: string) => void;
  },
) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <Stack>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            {comment.user}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {format(new Date(comment.date), "MMM d, yyyy • hh:mm a")}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {comment.text}
          </Typography>
        </Stack>
        {comment.userId === currentUser && (
          <CommentDeleteBtn onDelete={() => onDelete(comment._id)} />
        )}
      </Stack>
    </CardContent>
  </Card>
);

const CommentList = (
  { comments, currentUser, onDelete }: {
    comments: Comment[];
    currentUser: string;
    onDelete: (id: string) => void;
  },
) =>
  comments.length === 0
    ? (
      <Typography variant="body2" color="text.secondary">
        No comments yet
      </Typography>
    )
    : (
      <>
        {comments.map((comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
            currentUser={currentUser}
            onDelete={onDelete}
          />
        ))}
      </>
    );

const AddCommentForm = (
  { text, onChange, onSubmit }: {
    text: string;
    onChange: (val: string) => void;
    onSubmit: () => void;
  },
) => (
  <>
    <Divider sx={{ my: 3 }} />
    <Stack spacing={2}>
      <TextField
        label="Add a comment"
        multiline
        rows={3}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        onClick={onSubmit}
        disabled={!text.trim()}
        sx={{ alignSelf: "flex-end" }}
      >
        Submit
      </Button>
    </Stack>
  </>
);

const CommentsPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    fetchGet(`load-comments?postId=${postId}`).then((res) => {
      setComments(res.comments ?? []);
      setCurrentUser(res.currentUser ?? "");
    });
  }, [postId]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    const res = await fetchPost("add-comment", { postId: postId!, text });
    if (res.comment) {
      setComments((prev) => [...prev, res.comment]);
      setText("");
    }
  };

  const handleDelete = async (commentId: string) => {
    await fetchPost("delete-comment", { postId: postId!, commentId });
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  return (
    <Stack sx={{ maxWidth: 700, mx: "auto", mt: 4, px: 2 }}>
      <PageHeader onBack={() => navigate("/")} />
      <CommentList comments={comments} currentUser={currentUser} onDelete={handleDelete} />
      <AddCommentForm text={text} onChange={setText} onSubmit={handleSubmit} />
    </Stack>
  );
};

export default CommentsPage;
