const express = require('express')
const path = require('path')

const router = express.Router()

router.use('/api/v1', require('./api'))

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/api', (req, res) => {
    res.json({ status: 200, message: 'API server up and running...' })
})

router.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../public/404.html'))
})

module.exports = router