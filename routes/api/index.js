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

module.exports = router