import Togglable from './Togglable'

const Blog = ({ blog, likeBlog, removeBlog, currentUser }) => (
  <div>
    <p>{blog.title}</p>
    <Togglable buttonLabel='view' buttonLabel2='hide'>
      <p>{blog.author}</p>
      <p>{blog.url}</p>
      <p>
        Likes: {blog.likes}{' '}
        <button onClick={() => likeBlog(blog)}>like</button>
      </p>
      <p>
        <b>added by {blog.user.username}</b>
      </p>
      {currentUser?.username === blog.user.username && (
          <mark>
            <button onClick={() => removeBlog(blog)}>remove</button>
          </mark>
      )}
    </Togglable>
  </div>  
)

export default Blog
