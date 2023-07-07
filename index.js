require('dotenv').config()
const { Sequelize, QueryTypes, Model, DataTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)
sequelize.authenticate()
const express = require('express')
const app = express()

class Note extends Model { }

Note.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    important: {
        type: DataTypes.BOOLEAN
    },
    date: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'note'
})

app.get('/api/notes', async (req, res) => {
    const notes = await Note.findAll()
    res.json(notes)
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`)
})