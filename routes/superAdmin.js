const express = require('express')

const { checUserSuperAdmin } = require('../middlewares')

const router = express.Router()

router.use(checUserSuperAdmin)

router.get('/', (req, res) => {

    res.render('admin')
})

module.exports = router