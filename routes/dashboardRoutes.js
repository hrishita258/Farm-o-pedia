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

// router.get('/admin', (req, res) => {
//     res.render('dashboard')
// })

// router.get('/admin/patientdetails', (req, res) => {
//     res.render('Patient')
// })

// router.get('/admin/notification', (req, res) => {
//     res.render('notification')
// })

// router.get('/superadmin', (req, res) => {
//     res.render('admin')
// })

router.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../public/404.html'))
})

module.exports = router