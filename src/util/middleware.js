/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');
const { User, Token } = require('../models');

const errorHandler = (err, req, res, _next) => {
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: 'bad request', message: err.message });
  }
  if (err.name === 'SequelizeValidationError') {
    const messages = [];
    err.errors.forEach((e) => messages.push(e.message));
    return res.status(400).json({ error: 'bad request', messages });
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    const messages = [];
    err.errors.forEach((e) => messages.push(e.message));
    return res.status(400).json({ error: 'bad request', messages });
  }
  const infoToSend = process.env.NODE_ENV === 'production' ? 'unknown error' : err;
  return res.status(400).json({ error: 'bad request', message: err?.message, info: infoToSend });
};

// auth scheme: create token on login and save to token table (login.js)
// on authentication:
// 1. jwt library checks for signature and expiry, throws error if either fails
// 2. make sure token in db is same as the one that was provided
const userAuther = async (req, res, next) => {
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    try {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
      const user = await User.findByPk(decodedToken.id);
      if (user.disabled) throw new Error('This user is disabled');
      const dbToken = await Token.findOne({ where: { userId: user.id } });
      if (dbToken.token !== auth.substring(7)) {
        throw new Error('Token integrity error, please login again');
      }
      req.decodedToken = decodedToken;
      req.user = user;
      return next();
    } catch (error) {
      return next(error);
    }
  }
  return res.status(401).json({ error: 'login required' });
};

module.exports = {
  errorHandler, userAuther,
};
