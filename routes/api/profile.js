const express = require('express')

const router = express.Router()

const { QuarantinedPeople } = require('../../models')
const { authToken } = require('../../middlewares')

router.use(authToken)

router.get('/', async (req, res) => {
    const foundUser = await QuarantinedPeople.findOne({ _id: req.user._id })
    if (!foundUser) return res.json({ status: 404, statusCode: 'failed', message: 'Not Found' })
    res.json({ status: 200, statusCode: 'success', message: 'Profile', data: foundUser })
})

module.exports = router