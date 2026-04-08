import { useReducer } from "react";
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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          title:{" "}
          <input
            name="title"
            value={state.title}
            placeholder="title here..."
            onChange={handleChange}
          />
        </div>
        <div>
          author:{" "}
          <input
            name="author"
            value={state.author}
            placeholder="author here..."
            onChange={handleChange}
          />
        </div>
        <div>
          url:{" "}
          <input
            name="url"
            value={state.url}
            placeholder="url here..."
            onChange={handleChange}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
