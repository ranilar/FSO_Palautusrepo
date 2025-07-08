const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {

  try {
    const blogs = await Blog.find({})
    res.status(200).json(blogs)
  } catch (exception) {
    next(exception)
  }
  
})

blogsRouter.post('/', async (req, res, next) => {
  if (!req.body.likes) {
    req.body.likes = 0
  }
  if (!req.body.title || !req.body.url) {
    return res.status(400).json({ error: 'title or url missing' })
  }

  try {
    const blog = new Blog(req.body)
    const savedBlog = await blog.save()
    res.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (req, res, next) => {
  console.log(req.params.id)
  try {
    const newBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, context: 'query' }
    )
    console.log('updating...')

    if (newBlog) {
      res.status(200).json(newBlog)
    } else {
      res.status(404).end()
    }
  } catch(expection) {
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

module.exports = blogsRouter