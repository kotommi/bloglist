const router = require('express').Router();

const { User, Blog } = require('../models');
const { errorHandler } = require('../util/middleware');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: {
      exclude: ['id'],
    },
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId'],
      },

    },
  });
  return res.json(users);
});

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } });
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }
    user.name = req.body.name;
    await user.save();
    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

router.use(errorHandler);

module.exports = router;
