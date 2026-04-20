import { useState, useEffect, useRef, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import { Routes, Route, Link } from "react-router-dom";
import styled from "styled-components";
import NotificationContext from "./contexts/NotificationContext";
import UserContext from "./contexts/UserContext";
import Notification from "./components/Notification";
import Blog from "./components/Blog";
import OneBlogView from "./components/OneBlogView";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Users from "./components/UsersView";
import OneUserView from "./components/OneUserView";
import blogService from "./services/blogs";
import loginService from "./services/login";
import persistentUser from "./services/persistentUser";
import Togglable from "./components/Togglable";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

const Page = styled.div`
  padding: 1em;
  background: papayawhip;
  min-height: 100vh;
`;

const Footer = styled.div`
  background: Chocolate;
  padding: 1.5em;
  margin-top: 2em;
  text-align: center;
  border-radius: 4px;
  color: white;
`;

const NavigationWrapper = styled.div`
  margin-bottom: 2em;
`;

const App = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext);
  const [user, userDispatch] = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const blogFormRef = useRef();
  const queryClient = useQueryClient();

  const blogsResult = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  });

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog));
      notificationDispatch({
        type: "SHOW",
        payload: {
          message: `A new blog ${newBlog.title} by ${newBlog.author} added`,
          type: "notice",
        },
      });
      setTimeout(() => notificationDispatch({ type: "HIDE" }), 5000);
    },
    onError: () => {
      notificationDispatch({
        type: "SHOW",
        payload: { message: "Failed to add blog", type: "error" },
      });
      setTimeout(() => notificationDispatch({ type: "HIDE" }), 5000);
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: (updatedBlog) =>
      blogService.update(updatedBlog.id, updatedBlog),
    onSuccess: (returnedBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((b) => (b.id === returnedBlog.id ? returnedBlog : b)),
      );
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (_data, id) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.filter((b) => b.id !== id),
      );

      notificationDispatch({
        type: "SHOW",
        payload: { message: "Blog deleted", type: "notice" },
      });
      setTimeout(() => notificationDispatch({ type: "HIDE" }), 5000);
    },
  });

  useEffect(() => {
    const user = persistentUser.getUser();
    if (user) {
      userDispatch({ type: "SET", payload: user });
      blogService.setToken(user.token);
    }
  }, [userDispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      persistentUser.saveUser(user);
      blogService.setToken(user.token);
      userDispatch({ type: "SET", payload: user });
      setUsername("");
      setPassword("");
    } catch (exception) {
      notificationDispatch({
        type: "SHOW",
        payload: { message: "Wrong username or password", type: "error" },
      });
      setTimeout(() => notificationDispatch({ type: "HIDE" }), 5000);
    }
  };

  const handleLogout = () => {
    persistentUser.removeUser();
    userDispatch({ type: "CLEAR" });
    blogService.setToken(null);
  };

  const addBlog = (blogObject) => {
    newBlogMutation.mutate(blogObject);
    blogFormRef.current.toggleVisibility();
  };

  const likeBlog = (blog) => {
    updateBlogMutation.mutate({
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    });
  };

  const removeBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlogMutation.mutate(blog.id);
    }
  };

  if (blogsResult.isLoading) return <div>loading data...</div>;

  const blogs = blogsResult.data;

  if (user === null) {
    return (
      <Page>
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ mb: 2, mt: 4 }}>
            Log in to application
          </Typography>
          <Notification
            message={notification.message}
            type={notification.type}
          />
          <LoginForm
            handleLogin={handleLogin}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            username={username}
            password={password}
          />
        </Container>
      </Page>
    );
  }

  const navStyle = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };

  return (
    <Page>
      <Container>
        <ErrorBoundary>
          <NavigationWrapper>
            <AppBar position="static" sx={{ bgcolor: "BurlyWood" }}>
              <Toolbar>
                <Button color="inherit" component={Link} to="/" sx={navStyle}>
                  blogs
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/users"
                  sx={navStyle}
                >
                  users
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="body1" sx={{ mr: 2, color: "black" }}>
                  {user.username} logged in
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={handleLogout}
                >
                  logout
                </Button>
              </Toolbar>
            </AppBar>
          </NavigationWrapper>

          <Notification
            message={notification.message}
            type={notification.type}
          />

          <Routes>
            <Route
              path="/"
              element={
                <Box>
                  <Typography variant="h4" sx={{ mb: 3 }}>
                    Blogs
                  </Typography>

                  <Togglable
                    buttonLabel="create new blog"
                    buttonLabel2="cancel"
                    ref={blogFormRef}
                  >
                    <BlogForm createBlog={addBlog} blogFormRef={blogFormRef} />
                  </Togglable>

                  <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>Blog</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Author</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>Action</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {blogs
                          .sort((a, b) => b.likes - a.likes)
                          .map((blog) => (
                            <TableRow key={blog.id} hover>
                              <TableCell>
                                <Link
                                  to={`/blogs/${blog.id}`}
                                  style={{
                                    fontWeight: "bold",
                                    color: "Chocolate",
                                  }}
                                >
                                  {blog.title}
                                </Link>
                              </TableCell>
                              <TableCell>{blog.author}</TableCell>
                              <TableCell align="right">
                                <Blog
                                  blog={blog}
                                  likeBlog={likeBlog}
                                  removeBlog={removeBlog}
                                  currentUser={user}
                                  simpleView={true}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              }
            />
            <Route path="/blogs/:id" element={<OneBlogView />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<OneUserView />} />
            <Route
              path="*"
              element={
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h5">Page not found</Typography>
                </Box>
              }
            />
          </Routes>

          <Footer>
            <Typography variant="body2">
              Blog app by Ipoldius - Full Stack Open
            </Typography>
          </Footer>
        </ErrorBoundary>
      </Container>
    </Page>
  );
};

export default App;
