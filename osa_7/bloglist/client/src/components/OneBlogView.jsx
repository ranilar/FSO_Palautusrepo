import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Paper,
} from "@mui/material";
import { useState } from "react";
import blogService from "../services/blogs";

const OneBlogView = () => {
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blogs", id],
    queryFn: () => blogService.getOne(id),
  });

  const commentMutation = useMutation({
    mutationFn: (newComment) => blogService.addComment(id, newComment),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(["blogs", id], updatedBlog);
      const blogs = queryClient.getQueryData(["blogs"]);
      if (blogs) {
        queryClient.setQueryData(
          ["blogs"],
          blogs.map((b) => (b.id === id ? updatedBlog : b)),
        );
      }
      setComment("");
    },
  });

  const handleComment = (event) => {
    event.preventDefault();
    if (comment.trim()) commentMutation.mutate(comment);
  };

  if (isLoading) return <Typography>loading...</Typography>;
  if (!blog) return <Typography>Blog not found</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {blog.title} by {blog.author}
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography component="div">
          <a href={blog.url}>{blog.url}</a>
        </Typography>
        <Typography variant="body1" sx={{ my: 2 }}>
          {blog.likes} likes
        </Typography>
        <Typography variant="subtitle2">
          added by {blog.user.username}
        </Typography>
      </Paper>

      <Typography variant="h5">Comments</Typography>
      <Box
        component="form"
        onSubmit={handleComment}
        sx={{ display: "flex", gap: 1, my: 2 }}
      >
        <TextField
          size="small"
          label="write a comment..."
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <Button variant="contained" type="submit">
          add comment
        </Button>
      </Box>

      <List component={Paper}>
        {blog.comments.map((c, index) => (
          <div key={index}>
            <ListItem>
              <ListItemText primary={c} />
            </ListItem>
            {index < blog.comments.length - 1 && <Divider />}
          </div>
        ))}
        {blog.comments.length === 0 && (
          <ListItem>
            <ListItemText secondary="No comments yet." />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default OneBlogView;
