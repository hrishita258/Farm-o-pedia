const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

const { QuarantinedUser } = require('../../models')

router.get('/', (req, res) => {
    res.status(400).json({ status: 400, message: 'Send post request to this api' })
})

router.post('/', async (req, res) => {
    // let { name1, name2, phoneNumber1, phoneNumber2, age, gender, dateAnnounced, currentStatus, detectedCity, block, detectedState, nationality, address, registrationLocation, quarantineLocation, travelHistory, password } = req.body
    // custom objects
    let { name1, name2, phoneNumber1, phoneNumber2, age, gender, dateAnnounced, currentStatus, detectedCity, block, detectedState, nationality, address, rlatitude, rlongitude, qlatitude, qlongitude, troute, tdate, password } = req.body
    let registrationLocation = { latitude: rlatitude, longitude: rlongitude }
    let quarantineLocation = { latitude: qlatitude, longitude: qlongitude }
    let travelHistory = { route: troute, date: tdate }
    // end
    if (password && password.length < 6) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'Password length should be more than 6' })
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
                res.status(201).json({ status: 201, statusCode: 'success', message: 'Registration Successful', user: result })
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