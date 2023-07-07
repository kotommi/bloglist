const router = require('express').Router()
const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.findAll();
    res.json(blogs)
})

router.post('/api/blogs', async (req, res) => {
    try {
        console.log(req.body)
        const blog = await Blog.create(req.body)
        return res.json(blog)
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error })
    }
})

router.get('/api/blogs/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        return res.json(req.blog)
    } else {
        return res.sendStatus(404)
    }
})

router.delete('/api/blogs/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        req.blog.destroy()
        return res.sendStatus(200)
    } else {
        return res.sendStatus(404)
    }

})

module.exports = router