import { useState, useEffect, useRef, useContext } from "react";
import NotificationContext from "./contexts/NotificationContext";
import Notification from "./components/Notification";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

const App = () => {
  const [notification, dispatch] = useContext(NotificationContext);
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const blogFormRef = useRef();

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const addBlog = async ({ title, author, url }) => {
    const newBlog = {
      title: title,
      author: author,
      url: url,
      user: {
        username: user.username,
        name: user.name,
        id: user.id,
      },
    };

    try {
      const blog = await blogService.create(newBlog);
      blog.user = {
        username: user.username,
        name: user.name,
        id: user.id,
      };

      setBlogs((blogs) => blogs.concat(blog));

      dispatch({
        type: "SHOW",
        payload: {
          message: `A new blog ${blog.title} by ${blog.author} added`,
          type: "notice",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);

      setTitle("");
      setAuthor("");
      setUrl("");
    } catch (error) {
      dispatch({
        type: "SHOW",
        payload: {
          message: "Failed to add blog, please try again.",
          type: "error",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    }
  };

  const removeBlog = async (blog) => {
    if (window.confirm("Delete blog?")) {
      try {
        await blogService.remove(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
        dispatch({
          type: "SHOW",
          payload: { message: "Blog deletion success", type: "notice" },
        });
        setTimeout(() => dispatch({ type: "HIDE" }), 5000);
      } catch (exception) {
        dispatch({
          type: "SHOW",
          payload: {
            message: "Something went wrong when removing blog",
            type: "error",
          },
        });
        setTimeout(() => dispatch({ type: "HIDE" }), 5000);
      }
    }
  };

  const likeBlog = async (blog) => {
    try {
      const updated = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id,
      };
      const returned = await blogService.update(blog.id, updated);
      setBlogs(
        blogs.map((b) =>
          b.id === blog.id ? { ...returned, user: blog.user } : b,
        ),
      );
    } catch (exception) {
      dispatch({
        type: "SHOW",
        payload: {
          message: "Something went wrong when liking blog",
          type: "error",
        },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    }
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch({
        type: "SHOW",
        payload: { message: "Wrong username or password", type: "error" },
      });
      setTimeout(() => dispatch({ type: "HIDE" }), 5000);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.clear();
    setUser(null);
    blogService.setToken(null);
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <LoginForm
          handleLogin={handleLogin}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          username={username}
          password={password}
        />
      </div>
    );
  }

  return (
    <div>
      <ErrorBoundary>
        <h2>blogs</h2>
        <Notification message={notification.message} type={notification.type} />
        <p>
          {user.username} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
        <Togglable
          buttonLabel="create new blog"
          buttonLabel2="cancel"
          ref={blogFormRef}
        >
          <BlogForm
            createBlog={addBlog}
            blogFormRef={blogFormRef}
            addBlog={addBlog}
            likeBlog={likeBlog}
            title={title}
            author={author}
            url={url}
            handleTitleChange={handleTitleChange}
            handleAuthorChange={handleAuthorChange}
            handleUrlChange={handleUrlChange}
          />
        </Togglable>
        <br />
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
      </ErrorBoundary>
    </div>
  );
};

export default App;
