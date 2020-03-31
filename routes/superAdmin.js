const express = require('express')

const { checUserSuperAdmin } = require('../middlewares')

const router = express.Router()

router.use(checUserSuperAdmin)

router.get('/', (req, res) => {
    res.send('Super Admin')
})

module.exports = router