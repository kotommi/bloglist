const router = require('express').Router();
const { Blog } = require('../models');
const { sequelize } = require('../util/db');

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    // every attribute needs to be 'consumed' on an aggregate query
    // so we select only the ones we use
    // note the syntax for the aggregates [function, column, aggregate column name],
    // without the new name the result doesn't show in query
    attributes: ['author', [sequelize.fn('sum', sequelize.col('likes')), 'likes'], [sequelize.fn('count', sequelize.col('id')), 'blogs']],
    group: ['author'],
    order: [['likes', 'DESC']], // referring to the agg col works just fine
  });
  return res.json(authors);
});

module.exports = router;
