const router = require('express').Router()
const { Blog } = require('../models')
const { errorHandler } = require('../util/middleware')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.findAll();
    res.json(blogs)
})

router.post('/api/blogs', async (req, res, next) => {
    try {
        const blog = await Blog.create(req.body)
        return res.json(blog)
    } catch (error) {
        next(error)
    }
})

router.get('/api/blogs/:id', blogFinder, (req, res) => {
    if (req.blog) {
        return res.json(req.blog)
    } else {
        return res.sendStatus(404)
    }
})

router.delete('/api/blogs/:id', blogFinder, (req, res) => {
    if (req.blog) {
        req.blog.destroy()
        return res.sendStatus(200)
    } else {
        return res.sendStatus(404)
    }
})

router.put('/api/blogs/:id', blogFinder, async (req, res, next) => {
    if (!req.blog) {
        return res.sendStatus(404)
    }
    try {
        const blog = req.blog
        blog.likes = req.body?.likes
        await blog.save()
        return res.json(blog)
    } catch (error) {
        next(error)
    }
})

router.use(errorHandler)

module.exports = router