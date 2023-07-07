const errorHandler = (err, req, res, next) => {
    if (err.name === 'SequelizeDatabaseError') {
        return res.status(400).json({ error: 'bad request', message: err.message })
    }
    if (err.name === 'SequelizeValidationError') {
        const messages = []
        err.errors.forEach(e => messages.push(e.message))
        return res.status(400).json({ error: 'bad request', messages })
    }
    if (err.name === 'SequelizeUniqueConstraintError') {
        const messages = []
        err.errors.forEach(e => messages.push(e.message))
        return res.status(400).json({ error: 'bad request', messages })
    }
    return res.status(400).json({ error: 'bad request', message: err?.message, err })
}

module.exports = {
    errorHandler
}