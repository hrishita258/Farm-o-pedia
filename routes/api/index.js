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
// router.use('/outofarea', require('./outOfArea'))
router.use('/changepassword', require('./changePassword'))
router.use('/endquarantine', require('./endQuarantine'))
router.use('/changequarantinelocation', require('./changeQuarantineLocation'))
// Temporary routes
router.post('/temp', async (req, res) => {
    let { file } = req.body
    let base64Image = file.split(';base64,').pop()
    const fs = require('fs')
    fs.writeFile('uploads/image.bmp', base64Image, { encoding: 'base64' }, function (err) {
        console.log('File created')
    })
    res.send('Upload successfull')
})

module.exports = router