// eslint-disable-next-line no-unused-vars
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

module.exports = {
  errorHandler,
};
