import { useState } from 'react'

const BlogForm = ({ createBlog, blogFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
    blogFormRef.current.toggleVisibility()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>title: <input value={title} placeholder='title here...' onChange={({ target }) => setTitle(target.value)} /></div>
        <div>author: <input value={author} placeholder='author here...' onChange={({ target }) => setAuthor(target.value)} /></div>
        <div>url: <input value={url} placeholder='url here...' onChange={({ target }) => setUrl(target.value)} /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
