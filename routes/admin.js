const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

const { checUserAdmin } = require('../middlewares')
const { QuarantinedUser } = require('../models')

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
            _id: req.params.id
        })
        if (!foundPatient) return res.redirect('/')
        res.render('Patient', { foundPatient })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

router.post('/patient', (req, res) => {
    let { phoneNumber } = req.body
    // TODO send link to phone
    res.json({ status: 200, message: `SMS sent to ${phoneNumber}` })
})

module.exports = router