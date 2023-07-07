require('dotenv').config()
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')


const blogRouter = require('./controllers/blogs')


const express = require('express')
const app = express()
app.use(express.json())
app.use(blogRouter)

const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

start()
