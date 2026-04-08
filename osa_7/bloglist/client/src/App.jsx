import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const blogFormRef = useRef()

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const addBlog = async ({ title, author, url }) => {

    const newBlog = {
      title: title,
      author: author,
      url: url,
      user: {
    username: user.username,
    name: user.name,
    id: user.id
      }
    }
    console.log(newBlog)

    try {
      blogFormRef.current.toggleVisibility()
      const blog = await blogService.create(newBlog)
      blog.user = {
        username: user.username,
        name: user.name,
        id: user.id
      }

      setBlogs(blogs => blogs.concat(blog))
      setMessage(`A new blog ${blog.title} by ${blog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)

      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      console.error('Error adding blog:', error.response?.data || error)
      setErrorMessage('Failed to add blog, please try again.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const removeBlog = async (blog) => {
    console.log(blog)
  if (window.confirm('Delete blog?')) {
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      setMessage(
          'Blog deletion success'
        )
    } catch (exception) {
      setErrorMessage('Something went wrong when removing blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  } else { window.alert('k then')}
}

const likeBlog = async (blog) => {
  console.log(blog)
  try {
  const updated = {
    ...blog,
    likes: blog.likes + 1,
    user: blog.user.id
  }
  console.log(updated)
  const returned = await blogService.update(blog.id, updated)
  setBlogs(blogs.map(b => b.id === blog.id ? { ...returned, user: blog.user } : b))
  } catch(exception) {
    setErrorMessage('Something went wrong when removing blog')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }
}

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])



  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      console.log(user)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
    blogService.setToken(null)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} type='error' />
        <LoginForm handleLogin={handleLogin}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          username={username}
          password={password} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} type='notice' />
      <p>{user.username} logged in<button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel="create new blog" buttonLabel2='cancel' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} blogFormRef={blogFormRef}
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
      <br/>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
      <div key={blog.id} className='blogStyle'>
            <Blog blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} currentUser={user}/>
      </div>
      )}
    </div>
  )
}

export default App