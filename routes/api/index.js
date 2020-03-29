const express = require('express')

const router = express.Router()

const { authApiKey, authToken } = require('../../middlewares')

router.use(authApiKey)

router.get('/', (req, res) => {
    res.json({ status: 200, statusCode: 'success', message: 'API v1 server up and running...' })
})

router.use('/register', require('./register'))
router.use('/login', require('./login'))
router.use('/token', require('./token'))
router.use('/logout', require('./logout'))

router.get('/protected', authToken, (req, res) => {
    res.send('protected')
})

module.exports = router