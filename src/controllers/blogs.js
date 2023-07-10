const router = require('express').Router();

const { Op } = require('sequelize');
const { Blog, User } = require('../models');
const { errorHandler, userAuther } = require('../util/middleware');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get('/', async (req, res) => {
  let where = {};
  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.substring]: req.query.search,
          },
        },
        {
          author: {
            [Op.substring]: req.query.search,
          },
        },
      ],
    };
  }
  const blogs = await Blog.findAll({
    attributes: {
      exclude: ['userId'],
    },
    include: {
      model: User,
      attributes: ['username'],
    },
    where,
    order: [['likes', 'DESC']],
  });
  res.json(blogs);
});

router.post('/', userAuther, async (req, res, next) => {
  try {
    const blog = await Blog.create({
      title: req.body.title,
      url: req.body.url,
      author: req.body.author,
      likes: req.body.likes,
      userId: req.body.user.id,
    });
    return res.json(blog);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', blogFinder, (req, res) => {
  if (req.blog) {
    return res.json(req.blog);
  }
  return res.sendStatus(404);
});

router.delete('/:id', userAuther, blogFinder, (req, res) => {
  if (req.blog) {
    if (req.blog.userId === req.decodedToken.id) {
      req.blog.destroy();
      return res.sendStatus(200);
    }
    return res.status(403).json({ error: 'wrong user' });
  }
  return res.sendStatus(404);
});

router.put('/:id', blogFinder, async (req, res, next) => {
  if (!req.blog) {
    return res.sendStatus(404);
  }
  try {
    const { blog } = req;
    blog.likes = req.body?.likes;
    await blog.save();
    return res.json(blog);
  } catch (error) {
    return next(error);
  }
});

router.use(errorHandler);

module.exports = router;
