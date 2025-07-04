const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('./test_data.js')

test('dummy returns one', () => {
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})


describe('total likes', () => {
  test('sum of all of the blogs likes is correct', () => {
    const result  = listHelper.totalLikes(blogs)
    assert.equal(result, 36)
  })
})

describe('blog with most likes', () => {
  let mostLiked = {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    }
  test('correctly returns one of most liked blogs', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, mostLiked)
  })
})

describe('author with most blogs', () => {
  test('returns author with most written blogs in given array', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3
      })
  })
})

describe('author with most likes', () => {
    test('returns author with most likes across all blogs written', () => {
      const result = listHelper.mostLikedAuthor(blogs)
      assert.deepStrictEqual(result, {
        author: "Edsger W. Dijkstra",
        likes: 17
      })
    })
})