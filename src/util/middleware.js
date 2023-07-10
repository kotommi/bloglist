/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

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

// idea: find the user and append to body
const userAuther = (req, res, next) => {
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
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
