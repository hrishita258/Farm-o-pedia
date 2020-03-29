const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.json({ status: 200, message: 'API v1 server up and running...' })
})

module.exports = router