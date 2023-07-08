const { Blog } = require('../models')
const { sequelize } = require('../util/db')
const router = require('express').Router()

router.get('/', async (req, res) => {
    const authors = await Blog.findAll({
        attributes: ['author', [sequelize.fn('sum', sequelize.col('likes')), 'likes'], [sequelize.fn('count', sequelize.col('id')), 'blogs']],
        group: ['author']
    })
    return res.json(authors)
})

module.exports = router