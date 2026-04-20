import { useReducer } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import blogFormReducer from "../reducers/blogFormReducer";

const BlogForm = ({ createBlog, blogFormRef }) => {
  const [state, dispatch] = useReducer(blogFormReducer, {
    title: "",
    author: "",
    url: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    createBlog(state);
    dispatch({ type: "RESET" });
    blogFormRef.current.toggleVisibility();
  };

  const handleChange = (event) => {
    dispatch({
      type: "SET_FIELD",
      field: event.target.name,
      value: event.target.value,
    });
  };

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Create a New Blog
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Title"
              name="title"
              variant="outlined"
              size="small"
              fullWidth
              value={state.title}
              placeholder="title here..."
              onChange={handleChange}
            />
            <TextField
              label="Author"
              name="author"
              variant="outlined"
              size="small"
              fullWidth
              value={state.author}
              placeholder="author here..."
              onChange={handleChange}
            />
            <TextField
              label="URL"
              name="url"
              variant="outlined"
              size="small"
              fullWidth
              value={state.url}
              placeholder="url here..."
              onChange={handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                alignSelf: "flex-start",
                mt: 1,
                bgcolor: "Chocolate",
                "&:hover": { bgcolor: "#a0522d" },
              }}
            >
              Create
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default BlogForm;
