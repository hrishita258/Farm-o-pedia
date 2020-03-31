const express = require('express')

const { checUserAdmin } = require('../middlewares')
const { QuarantinedUser } = require('../models')

const router = express.Router()

router.use(checUserAdmin)

router.get('/', async (req, res) => {
    const foundUsers = await QuarantinedUser.find({
        detectedState: req.user.state,
        detectedCity: req.user.city,
        block: req.user.block
    })
    res.render('admin', { users: foundUsers })
})

module.exports = router