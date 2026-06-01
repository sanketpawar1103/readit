import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const CommentsPage = () => (
  <Stack sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
    <Typography variant="h6">Comments</Typography>
    <Typography variant="body2" color="text.secondary">
      Loading comments…
    </Typography>
  </Stack>
);

export default CommentsPage;
