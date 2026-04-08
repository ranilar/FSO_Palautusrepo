const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')


const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

    const testBlog = {
        title: "testtitle",
        author: "testauthor",
        url: "testurl",
        likes: 0
    }
  const res = await api
  .post('/api/blogs/')
  .send(testBlog)
  .expect(201)
})

test('GET returns correct amount of blogs', async () => {
    
    const res = await api.get('/api/blogs/')

    assert.strictEqual(res.body.length, 1)
})

test('blog id field correct', async () => {
    const res = await api.get('/api/blogs/')
    const blog = res.body[0]

    assert.ok('id' in blog, 'id field as "id", and not as "_id"')
    assert.ok(!('_id' in blog))
})

test('POST adds blog correctly', async () => {
    const getres = await api.get('/api/blogs/')
    const blogsBefore = getres.body.length

    const testBlog = {
        title: "testtitle",
        author: "testauthor",
        url: "testurl",
        likes: 0
    }
    const res = await api
    .post('/api/blogs/')
    .send(testBlog)
    .expect(201)

    const getresafter = await api.get('/api/blogs/')
    const blogsAfter= getresafter.body.length
    
    assert.notEqual(blogsBefore, blogsAfter)
})

test('returns status code 400 if title is missing', async () => {

    const testBlog = {
        author: "testauthor",
        url: "testurl",
        likes: 0
    }
    const res = await api
    .post('/api/blogs/')
    .send(testBlog)
    .expect(400)
})

test('returns status code 400 if url is missing', async () => {

    const testBlog = {
        title: "testtitle",
        author: "testauthor",
        likes: 0
    }
    const res = await api
    .post('/api/blogs/')
    .send(testBlog)
    .expect(400)
})

test('delete by id works', async () => {
    const testBlog = {
        title: "testtitle",
        author: "testauthor",
        url: "testurl",
        likes: 1
    }

    const newBlog = await api
    .post('/api/blogs/')
    .send(testBlog)
    .expect(201)

    const id = newBlog.body.id
    const deletion = await api
    .delete(`/api/blogs/${id}`)
    .expect(204)
     
})

test('PUT updates likes correctly', async () => {
  const newBlog = {
    title: "test",
    author: "tester",
    url: "testurl",
    likes: 0
  }

  const postRes = await api
    .post('/api/blogs/')
    .send(newBlog)
    .expect(201)

  const blogToUpdate = postRes.body
  const updatedLikes = { ...blogToUpdate, likes: 42 }

  const putRes = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedLikes)
    .expect(200)

  assert.equal(putRes.body.likes, 42)
})


after(async () => {
    await mongoose.connection.close()
})