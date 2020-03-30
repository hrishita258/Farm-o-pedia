const express = require('express')

const router = express.Router()

router.use('/api/v1', require('./api'))

router.get('/', (req, res) => {
    res.json({ status: 200, messsage: 'Server Up and running' })
})

router.get('/api', (req, res) => {
    res.json({ status: 200, message: 'API server up and running...' })
})

router.get('*', (req, res) => {
    res.status(404).json({ status: 404, message: 'Not Found' })
})

module.exports = router