require('dotenv').config()
const { Sequelize, QueryTypes, Model, DataTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)
const express = require('express')
const app = express()
app.use(express.json())

class Blog extends Model { }

Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.TEXT
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }

}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
})

Blog.sync()


app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.findAll();
    res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
    try {
        console.log(req.body)
        const blog = await Blog.create(req.body)
        return res.json(blog)
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error })
    }
})

app.get('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        return res.json(blog)
    } else {
        return res.sendStatus(404)
    }
})

app.delete('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        blog.destroy()
        return res.sendStatus(200)
    } else {
        return res.sendStatus(404)
    }

})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`)
})