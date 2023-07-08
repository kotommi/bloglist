require('dotenv').config();
const express = require('express');
const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const authorRouter = require('./controllers/authors');

const app = express();
app.use(express.json());
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/authors', authorRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
};

start();
