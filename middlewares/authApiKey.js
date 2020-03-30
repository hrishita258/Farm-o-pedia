if (process.env.NODE_ENV !== 'production') require('dotenv').config()
module.exports = (req, res, next) => {
    //if (req.headers['x-api-key'] != process.env.API_KEY) return res.status(403).json({ status: 403, message: 'Invalid API Key' })
    next()
}
