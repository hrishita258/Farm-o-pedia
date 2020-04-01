const express = require('express')

const router = express.Router()

const { authApiKey } = require('../../middlewares')

// router.use(authApiKey)

router.get('/', (req, res) => {
    res.json({ status: 200, statusCode: 'success', message: 'API v1 server up and running...' })
})

router.use('/register', require('./register'))
router.use('/login', require('./login'))
// router.use('/token', require('./token'))
// router.use('/logout', require('./logout'))
router.use('/profile', require('./profile'))
router.use('/upload', require('./upload'))
router.use('/outofarea', require('./outOfArea'))
router.use('/changepassword', require('./changePassword'))
router.use('/endquarantine', require('./endQuarantine'))
router.use('/changequarantinelocation', require('./changeQuarantineLocation'))
// Temporary routes
router.post('/temp', async (req, res) => {
    const { QuarantinedUserUpload } = require('../../models')
    if (!req.body.latitude || !req.body.longitude) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'latitude and longitude are required' })
    const quarantinedUserUpload = new QuarantinedUserUpload({
        _quarantinedUserId: '5e81e023d317f60cdcd97de5',
        uploadType: 'location',
        location: {
            latitude: req.body.latitude,
            longitude: req.body.longitude
        }
    })
    try {
        await quarantinedUserUpload.save()
        res.status(201).json({ status: 201, statusCode: 'success', message: 'Upload Successfully' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, statusCode: 500, message: 'Something went wrong', error: err })
    }
})

module.exports = router