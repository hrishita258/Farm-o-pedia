const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

const { checUserAdmin } = require('../middlewares')
const { QuarantinedUser } = require('../models')
const { randomString } = require('../util')

router.use(checUserAdmin)

router.get('/', async (req, res) => {
    const foundUsers = await QuarantinedUser.find({
        detectedState: req.user.state,
        detectedCity: req.user.city,
        block: req.user.block
    })
    res.render('admin', { users: foundUsers })
})

router.get('/patient/:id', async (req, res) => {
    try {
        const foundPatient = await QuarantinedUser.find({
            _id: req.params.id,
            detectedState: req.user.state,
            detectedCity: req.user.city,
            block: req.user.block
        })
        if (!foundPatient) return res.redirect('/')
        res.render('patient', { user: foundPatient })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

router.post('/patient', (req, res) => {
    let { name1, name2, phoneNumber1, phoneNumber2, age, gender, dateAnnounced, currentStatus, detectedCity, block, detectedState, nationality, address, latitude, longitude, route, travelType, date } = req.body
    let registrationLocation = { latitude: 0, longitude: 0 }
    let quarantineLocation = { latitude: 0, longitude: 0 }
    let travelHistory = { route, travelType, date }
    // let password = randomString(8)
    // TODO send password
    let password = 'password'
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ status: 500, statusCode: 'failed', error: err })
        }
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                console.log(err)
                return res.status(500).json({ status: 500, statusCode: 'failed', error: err })
            }
            try {
                const result = await QuarantinedUser.create({
                    name1, name2, phoneNumber1, phoneNumber2, age, gender, dateAnnounced, currentStatus, detectedCity, block, detectedState, nationality, address, registrationLocation, quarantineLocation, travelHistory, password: hash
                })
                res.redirect('/')
            } catch (err) {
                if (err.errmsg) if (err.errmsg.includes('E11000 duplicate key error collection: quarguard.quarantinedusers index: phoneNumber1')) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'Phone Number already registered' })
                if (err.message) if (err.message.includes('QuarantinedUser validation failed')) return res.status(400).json({ status: 400, statusCode: 'failed', message: err.message })
                res.status(500).json({ status: 500, statusCode: 'failed', message: 'Something went wrong', error: err })
                console.log(err)
            }
        })
    })
})

module.exports = router