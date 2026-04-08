import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useRef from 'react'
import Blog from './Blog'
import BlogForm from './BlogForm'

describe('Blog component', () => {
  const blog = {
    title: 'Testing title',
    author: 'Ilari Ranin',
    url: 'someurl.com',
    likes: 5,
    user: { username: 'tester' },
  }

    test('renders title', () => {
        render(<Blog blog={blog} />)

        const title = screen.getByText('Testing title')
        expect(title).toBeDefined()
    })


    test('shows url and likes when view button is clicked', async () => {
    const user = userEvent.setup()

    const handleLike = vi.fn()
    const handleRemove = vi.fn()

    render(
        <Blog
        blog={blog}
        likeBlog={handleLike}
        removeBlog={handleRemove}
        currentUser={blog.user}
        />
    )

    screen.debug()

    const viewButton = await screen.findByText('view')
    await user.click(viewButton)

    expect(screen.getByText(blog.url)).toBeDefined()
    expect(screen.getByText(String(blog.likes))).toBeDefined()
    expect(screen.getByText('added by tester')).toBeDefined()
    })

    test('calls like handler twice correctly', async () => {
    const likeBlog = vi.fn()
    const removeBlog = vi.fn()

    const user = userEvent.setup()

    render(
        <Blog
        blog={blog}
        likeBlog={likeBlog}
        removeBlog={removeBlog}
        currentUser={blog.user}
        />
    )

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(likeBlog).toHaveBeenCalledTimes(2)
    })

    test('calls onCreate correctly', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()
    const blogFormRef = {
    current: {
      toggleVisibility: vi.fn()
    },
  }

    render(<BlogForm createBlog={createBlog} blogFormRef={blogFormRef} />)

    const titleInput = screen.getByPlaceholderText(/title/i)
    const authorInput = screen.getByPlaceholderText(/author/i)
    const urlInput = screen.getByPlaceholderText(/url/i)
    const createButton = screen.getByText(/create/i)

    await user.type(titleInput, 'New Blog Title')
    await user.type(authorInput, 'Author Name')
    await user.type(urlInput, 'http://newblog.com')
    await user.click(createButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
        title: 'New Blog Title',
        author: 'Author Name',
        url: 'http://newblog.com',
    })
    })
})