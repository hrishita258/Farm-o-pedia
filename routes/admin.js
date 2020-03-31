const express = require('express')

const { checUserAdmin } = require('../middlewares')

const router = express.Router()

router.use(checUserAdmin)

router.get('/', (req, res) => {
    res.send('Admin')
})

module.exports = router