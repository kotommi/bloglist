const Blog = require('./blog');
const User = require('./user');
const Token = require('./token');
const Readinglist = require('./readinglist');

User.hasMany(Blog);
Blog.belongsTo(User);

User.hasMany(Token);
Token.belongsTo(User);

User.belongsToMany(Blog, { through: Readinglist, as: 'readingBlogs' });
Blog.belongsToMany(User, { through: Readinglist, as: 'onUserList' });

module.exports = {
  Blog,
  User,
  Readinglist,
  Token,
};
