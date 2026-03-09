const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let result = 0

    blogs.forEach(blog => {
        result = result + blog.likes
    })
    return result
}

const favoriteBlog = (blogs) => {
    let mostLikedBlog = {}
    let mostLikes = 0

    blogs.forEach(blog => {
        if (blog.likes > mostLikes) {
            mostLikes = blog.likes
            mostLikedBlog = blog
        }
    })
    return mostLikedBlog
}

const mostBlogs = (blogs) => {
    const blogsByAuthor = _.countBy(blogs, "author")
    const [topAuthor, count] = _.maxBy(Object.entries(blogsByAuthor), ([author, count]) => count)

    return ({
        author: topAuthor,
        blogs: count
    })
}

const mostLikedAuthor = (blogs) => {
    const grouped = _.groupBy(blogs, 'author')
    const likesByAuthor = _.map(grouped, (authorBlogs, author) => ({
        author,
        likes: _.sumBy(authorBlogs, 'likes')
    }))

    return _.maxBy(likesByAuthor, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikedAuthor
}