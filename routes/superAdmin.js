const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

const { checUserSuperAdmin } = require('../middlewares')
const { DashboardUser } = require('../models')
const { randomString } = require('../util')

router.use(checUserSuperAdmin)

router.get('/', async (req, res) => {
    const foundAdmins = await DashboardUser.find({ role: 1 })
    res.render('superAdmin', {
        users: foundAdmins
    })
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
        res.redirect('/')
    } catch (err) {
        if (err.errmsg)
            if (err.errmsg.includes('E11000 duplicate key error collection: quarguard.dashboardusers index: phoneNumber')) return res.send('Phone Number already exists')
        if (err.errmsg)
            if (err.errmsg.includes('E11000 duplicate key error collection: quarguard.dashboardusers index: email')) return res.send('Email already exists')
        if (err.name)
            if (err.name.includes('ValidationError')) return res.send('Validation Error must be a phone number')
        console.log(err)
        res.status(500).send('Something Went Wrong')
    }
})

router.delete('/admin/:id', async (req, res) => {
    try {
        await DashboardUser.deleteOne({ _id: req.params.id })
        res.redirect('/')
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

module.exports = router