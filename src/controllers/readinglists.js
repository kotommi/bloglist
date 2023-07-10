const router = require('express').Router();
const { Readinglist, User } = require('../models');
const { errorHandler, userAuther } = require('../util/middleware');

router.post('/', async (req, res, next) => {
  const blogId = req.body.blog_id;
  const userId = req.body.user_id;
  try {
    const readinglist = await Readinglist.create({ userId, blogId });
    return res.json(readinglist);
  } catch (error) {
    return next(error);
  }
});

router.post('/:id', userAuther, async (req, res, next) => {
  const readinglist = await Readinglist.findByPk(req.params.id);
  if (!readinglist) {
    return req.status(404).json({ error: 'readinglist not found' });
  }
  let user;
  try {
    user = await User.findByPk(req.decodedToken.id);
  } catch (error) {
    return next(error);
  }
  if (user.id !== readinglist.userId) {
    return res.status(403).json({ error: 'wrong user' });
  }
  try {
    readinglist.read = req.body.read;
    await readinglist.save();
    return res.json(readinglist);
  } catch (error) {
    return next(error);
  }
});

// debug route
router.get('/', async (req, res) => {
  const lists = await Readinglist.findAll({});
  return res.json(lists);
});

router.use(errorHandler);

module.exports = router;
