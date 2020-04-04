if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const path = require('path')

const { checkUserAuthenticated } = require('../middlewares')

const router = express.Router()

router.use(checkUserAuthenticated)

router.get('/', (req, res) => {
    if (req.user.role == 0) return res.redirect('/superadmin')
    else if (req.user.role == 1) return res.redirect('/admin')
    else {
        req.logOut()
        res.redirect('/login')
    }
})

router.use('/superadmin', require('./superAdmin'))
router.use('/admin', require('./admin'))

router.get('/map', (req, res) => {
    latitude = req.query.latitude
    longitude = req.query.longitude
    if (!latitude || !longitude) return res.redirect('/')
    res.render('map', { latitude, longitude })
})

router.post('/track', (req, res) => {
    let flightPath = JSON.parse(req.body.path)
    res.render('maps', { flightPath, apiKey: process.env.MAPS_API_KEY })
})

router.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../public/404.html'))
})

module.exports = router