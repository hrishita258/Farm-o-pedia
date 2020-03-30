if (process.env.NODE_ENV !== 'production') require('dotenv').config()
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
    let user
    try {
        user = await jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)
    } catch (err) {
        return res.status(401).json({ status: 401, statusCode: 'failed', message: 'Invalid Refresh Token' })
    }
    const foundRefreshToken = await RefreshToken.findOne({ refreshToken })
    if (!foundRefreshToken) return res.status(401).json({ status: 401, statusCode: 'failed', message: 'Login again' })
    const accessToken = await jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12),
        data: user.data
    }, process.env.JWT_ACCESS_TOKEN_SECRET)
    res.status(200).json({ status: 200, statusCode: 'success', message: 'New access token generated successfully', accessToken, refreshToken })
})

module.exports = router