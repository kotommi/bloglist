const router = require('express').Router();
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../util/config');
const { User, Token } = require('../models');

router.post('/', async (req, res) => {
  const { body } = req;

  const user = await User.findOne({ where: { username: body.username } });

  const passwordCorrect = body.password === 'salainen';

  if (!user || !passwordCorrect) {
    return res.status(401).json({ error: 'invalid username or password' });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };
  const token = jwt.sign(userForToken, JWT_SECRET, { expiresIn: '1h' });

  const dbToken = await Token.findOne({ where: { userId: user.id } });
  if (!dbToken) {
    await Token.create({ token, userId: user.id });
  } else {
    dbToken.token = token;
    await dbToken.save();
  }
  return res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = router;
