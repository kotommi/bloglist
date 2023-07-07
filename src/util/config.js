require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET || 'SECRET'
}