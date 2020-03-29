const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

const { QuarantinedPeople } = require('../../models')

router.get('/', (req, res) => {
    res.status(400).json({ status: 400, message: 'Send post request to this api' })
})

router.post('/', async (req, res) => {
    let { phoneNumber, password } = req.body
    if (!phoneNumber || !password) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'Phone number and password is required' })
    const user = await QuarantinedPeople.findOne({ phoneNumber1: phoneNumber })
    if (!user) return res.status(404).json({ status: 404, statusCode: 'failed', message: 'User Not Found' })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'Password is incorrect' })
    res.json({ status: 200, statusCode: 'success', message: 'Login Successfull', data: user })
})

module.exports = router