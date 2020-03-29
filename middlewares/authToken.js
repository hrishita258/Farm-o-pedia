if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    let token = req.headers['x-access-token']
    if (!token) res.status(403).json({ status: 403, statusCode: 'failed', message: 'Access Token is required in headers' })
    let user
    try {
        user = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
    } catch (err) {
        return res.status(401).json({ status: 401, statusCode: 'failed', message: 'Invalid Access Token' })
    }
    next()
}