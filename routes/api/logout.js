const express = require('express')
const jwt = require('jsonwebtoken')

const router = express.Router()

const { RefreshToken } = require('../../models')

router.get('/', (req, res) => {
    res.status(400).json({ status: 400, message: 'Send post request to this api' })
})

router.post('/', async (req, res) => {
    const { refreshToken } = req.body
    if (!refreshToken) res.status(400).json({ status: 400, message: 'refreshToken is required' })
    try {
        const user = await jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)
    } catch (err) {
        return res.status(401).json({ status: 401, statusCode: 'failed', message: 'Invalid Refresh Token' })
    }
    await RefreshToken.deleteMany({ refreshToken })
    res.status(200).json({ status: 200, statusCode: 'success', message: 'Logged out successfully' })
})

module.exports = router