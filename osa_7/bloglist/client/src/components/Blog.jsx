import { Link } from "react-router-dom";
import { Button, Box, Typography, Paper } from "@mui/material";
import Togglable from "./Togglable";

const Blog = ({ blog, likeBlog, removeBlog, currentUser }) => (
  <Paper sx={{ p: 2, mb: 2 }} elevation={2}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h6">
        <Link
          to={`/blogs/${blog.id}`}
          style={{ textDecoration: "none", color: "#d2691e" }}
        >
          {blog.title}
        </Link>
      </Typography>

      <Togglable buttonLabel="view" buttonLabel2="hide">
        <Box sx={{ mt: 2, pl: 2, borderLeft: "3px solid #deb887" }}>
          <Typography variant="body1">
            <strong>Author:</strong> {blog.author}
          </Typography>
          <Typography variant="body1">
            <strong>URL:</strong> {blog.url}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 1 }}>
            <Typography variant="body1">Likes: {blog.likes}</Typography>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => likeBlog(blog)}
            >
              like
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mb: 1 }}>
            added by{" "}
            <Link to={`/users/${blog.user.id}`}>{blog.user.username}</Link>
          </Typography>

          {currentUser?.username === blog.user.username && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => removeBlog(blog)}
            >
              remove
            </Button>
          )}
        </Box>
      </Togglable>
    </Box>
  </Paper>
);

export default Blog;
