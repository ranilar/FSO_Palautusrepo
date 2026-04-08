const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { user: 1, username: 1})
    res.status(200).json(blogs)
  } catch (exception) {
    next(exception)
  }
  
})

blogsRouter.post('/', async (req, res, next) => {
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!req.body.likes) {
    req.body.likes = 0
  }
  if (!req.body.title || !req.body.url) {
    return res.status(400).json({ error: 'title or url missing' })
  }

  if (!user) {
    return res.status(400).json({ error: 'userId missing or not valid' })
  }

  try {
    const blog = new Blog({
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes,
      user: user.id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (req, res, next) => {
  console.log(req.params.id, req.body)
  try {
    const newBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, context: 'query' }
    )

    if (newBlog) {
      res.status(200).json(newBlog)
    } else {
      res.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id',  async (req, res, next) => {
  try {
    const id = req.params.id
    response = await Blog.findByIdAndDelete(id)
    res.status(204).end()
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/', async (req, res, next) => {
  try {
    await Blog.deleteMany({})
    res.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter