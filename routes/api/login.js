if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router()

const { QuarantinedUser, RefreshToken } = require('../../models')

router.get('/', (req, res) => {
    res.status(400).json({ status: 400, message: 'Send post request to this api' })
})

router.post('/', async (req, res) => {
    const { phoneNumber, password } = req.body
    if (!phoneNumber || !password) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'Phone number and password is required' })
    const user = await QuarantinedUser.findOne({ phoneNumber1: phoneNumber })
    if (!user) return res.status(404).json({ status: 404, statusCode: 'failed', message: 'User Not Found' })
    if (user.quarantineEndAt) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'Quarantine has already ended' })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'Password is incorrect' })
    // const refreshToken = await jwt.sign({
    //     data: JSON.stringify(user)
    // }, process.env.JWT_REFRESH_TOKEN_SECRET)
    const accessToken = await jwt.sign({
        // exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12),
        data: JSON.stringify(user)
    }, process.env.JWT_ACCESS_TOKEN_SECRET)
    // await RefreshToken.create({
    //     _quarantinedUserId: user._id, refreshToken
    // })
    // res.json({ status: 200, statusCode: 'success', message: 'Login Successful', data: user, accessToken, refreshToken })
    res.json({ status: 200, statusCode: 'success', message: 'Login Successful', data: user, accessToken })
})

module.exports = router