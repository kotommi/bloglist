const router = require('express').Router()
const { Blog, User } = require('../models')
const jwt = require('jsonwebtoken')
const { errorHandler } = require('../util/middleware')
const { JWT_SECRET } = require('../util/config')
const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

// idea: find the user and append to body
const userAuther = (req, res, next) => {
    const auth = req.get('authorization')
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
        try {
            req.decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
            return next()
        } catch (error) {
            return next(error)
        }
    }
    return res.status(401).json({ error: 'login required' })
}

router.get('/', async (req, res) => {
    let where = {}
    if (req.query.search) {
        where = {
            [Op.or]: [
                {
                    title: {
                        [Op.substring]: req.query.search
                    }
                },
                {
                    author: {
                        [Op.substring]: req.query.search
                    }
                }
            ]
        }
    }
    const blogs = await Blog.findAll({
        attributes: {
            exclude: ['userId']
        },
        include: {
            model: User,
            attributes: ['username']
        },
        where,
        order: [['likes', 'DESC']]
    });
    res.json(blogs)
})

router.post('/', userAuther, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({ ...req.body, userId: user.id })
        return res.json(blog)
    } catch (error) {
        return next(error)
    }
})

router.get('/:id', blogFinder, (req, res) => {
    if (req.blog) {
        return res.json(req.blog)
    } else {
        return res.sendStatus(404)
    }
})

router.delete('/:id', userAuther, blogFinder, (req, res) => {
    if (req.blog) {
        if (req.blog.userId === req.decodedToken.id) {
            req.blog.destroy()
            return res.sendStatus(200)
        } else {
            return res.status(403).json({ error: 'wrong user' })
        }
    } else {
        return res.sendStatus(404)
    }
})

router.put('/:id', blogFinder, async (req, res, next) => {
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