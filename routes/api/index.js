const express = require('express')

const router = express.Router()

const { authApiKey } = require('../../middlewares')

router.use(authApiKey)

router.get('/', (req, res) => {
    res.json({ status: 200, statusCode: 'success', message: 'API v1 server up and running...' })
})

router.use('/login', require('./login'))
router.use('/register', require('./register'))

module.exports = router