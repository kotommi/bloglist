const router = require('express').Router();
const { Token } = require('../models');
const { userAuther, errorHandler } = require('../util/middleware');

router.delete('/', userAuther, async (req, res) => {
  const token = await Token.findOne({ where: { userId: req.body.user.id } });
  await token.destroy();
  return res.sendStatus(200);
});

router.use(errorHandler);

module.exports = router;
