const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

const { checUserSuperAdmin } = require('../middlewares')
const { DashboardUser, QuarantinedUser, QuarantinedUserUpload, userOutOfArea } = require('../models')
const { randomString } = require('../util')

router.use(checUserSuperAdmin)

router.get('/', async (req, res) => {
    const foundAdmins = await DashboardUser.find({ role: 1 })
    res.render('superAdmin', {
        users: foundAdmins
    })
})

router.get('/patients', async (req, res) => {
    const foundUsers = await QuarantinedUser.find()
    res.render('patients', { users: foundUsers }).sort({ createdAt: -1 })
})

router.get('/patient/:id', async (req, res) => {
    try {
        const foundPatient = await QuarantinedUser.findOne({
            _id: req.params.id
        })
        if (!foundPatient) return res.redirect('/')
        // console.log(foundPatient)
        const foundPatientUpload = await QuarantinedUserUpload.find({ _quarantinedUserId: foundPatient._id }).sort({ createdAt: 1 })
        const foundUserOutOfAreas = await userOutOfArea.find({ _quarantinedUserId: foundPatient._id }).sort({ createdAt: 1 })
        // console.log(foundUserOutOfAreas)
        res.render('Patient', { user: foundPatient, upload: foundPatientUpload, userOutOfArea: foundUserOutOfAreas })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

router.get('/admin/:id', async (req, res) => {
    try {
        const foundAdmin = await DashboardUser.findOne({ _id: req.params.id })
        if (!foundAdmin) return res.json({ status: 404, message: 'Not Found' })
        res.json({ status: 200, data: foundAdmin })
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

router.post('/admin', async (req, res) => {
    const { name, phoneNumber, email, state, city, block } = req.body
    const role = 1
    let password = randomString(8)
    // TODO send password and remove bottom string
    password = 'password'
    const salt = await bcrypt.genSalt(10)
    password = await bcrypt.hash(password, salt)
    try {
        await DashboardUser.create({
            name,
            email,
            phoneNumber,
            password,
            state,
            city,
            block,
            role
        })
        req.flash('success', 'User added successfully')
        res.redirect('/')
    } catch (err) {
        if (err.errmsg)
            if (err.errmsg.includes('E11000 duplicate key error collection: quarguard.dashboardusers index: phoneNumber')) {
                req.flash('error', 'Phone Number already exists')
                res.redirect('/')
            }
        if (err.errmsg)
            if (err.errmsg.includes('E11000 duplicate key error collection: quarguard.dashboardusers index: email')) {
                req.flash('error', 'Email already exists')
                res.redirect('/')
            }
        if (err.name)
            if (err.name.includes('ValidationError')) {
                req.flash('error', 'Validation Error must be a phone number')
                return res.redirect('/')
            }
        console.log(err)
        req.flash('error', 'Something went wrong')
        res.redirect('/')
    }
})

router.delete('/admin/:id', async (req, res) => {
    try {
        await DashboardUser.deleteOne({ _id: req.params.id })
        req.flash('success', 'User deleted successfully')
        res.redirect('/')
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

router.post('/patient', (req, res) => {
    let { name1, name2, phoneNumber1, phoneNumber2, age, gender, dateAnnounced, currentStatus, detectedCity, block, detectedState, nationality, address, route, date, latitude, longitude, fever, cough, breathing } = req.body
    nationality = 'india'
    currentStatus = 'quarantined'
    let travelHistory = { route, date }
    let password = randomString(8)
    // TODO send random generated password and remove the below line
    password = 'password'
    let quarantineLocation = { latitude: 0, longitude: 0 }
    let registrationLocation = { latitude, longitude }
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
                    name1, name2, phoneNumber1, phoneNumber2, age, gender, dateAnnounced, currentStatus, detectedCity, block, detectedState, nationality, address, registrationLocation, quarantineLocation, travelHistory, password: hash, fever, cough, breathing
                })
                res.status(201).json({ status: 201, statusCode: 'success', message: 'Registration Successful', user: result })
            } catch (err) {
                // if (err.errmsg) if (err.errmsg.includes('E11000 duplicate key error collection: quarguard.quarantinedusers index: phoneNumber1')) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'Phone Number already registered' })
                // if (err.message) if (err.message.includes('QuarantinedUser validation failed')) return res.status(400).json({ status: 400, statusCode: 'failed', message: err.message })
                if (err.errmsg) if (err.errmsg.includes('E11000 duplicate key error collection: quarguard.quarantinedusers index: phoneNumber1')) {
                    return res.status(400).json({ status: 400, message: 'Phone Number already exists' })
                }
                if (err.message) if (err.message.includes('QuarantinedUser validation failed')) {
                    return res.status(400).json({ status: 400, message: err.message })
                }
                res.status(500).json({ status: 500, message: 'Something went wrong' })
                console.log(err)
            }
        })
    })
})

router.get('/map', (req, res) => {
    latitude = req.query.latitude
    longitude = req.query.longitude
    if (!latitude || !longitude) return res.redirect('/')
    res.render('map', { latitude, longitude })
})

module.exports = router