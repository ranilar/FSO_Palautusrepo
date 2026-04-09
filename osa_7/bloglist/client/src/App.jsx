import { useState, useEffect, useRef, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import NotificationContext from "./contexts/NotificationContext";
import UserContext from "./contexts/UserContext";
import Notification from "./components/Notification";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import persistentUser from "./services/persistentUser";
import Togglable from "./components/Togglable";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

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
    onSuccess: (id) => {
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
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <LoginForm
          handleLogin={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Notification message={notification.message} type={notification.type} />

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h2>blogs</h2>
              <p>
                {user.username} logged in
                <button onClick={handleLogout}>logout</button>
              </p>

              <Togglable
                buttonLabel="create new blog"
                buttonLabel2="cancel"
                ref={blogFormRef}
              >
                <BlogForm createBlog={addBlog} blogFormRef={blogFormRef} />
              </Togglable>

              {blogs
                .sort((a, b) => b.likes - a.likes)
                .map((blog) => (
                  <div key={blog.id} className="blogStyle">
                    <Blog
                      blog={blog}
                      likeBlog={likeBlog}
                      removeBlog={removeBlog}
                      currentUser={user}
                    />
                  </div>
                ))}
            </div>
          }
        />

        <Route
          path="*"
          element={
            <div>
              <h2>Page not found</h2>
            </div>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
