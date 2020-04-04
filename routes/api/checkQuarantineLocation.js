const express = require('express')

const router = express.Router()

const { authToken } = require('../../middlewares')
const { QuarantinedUser } = require('../../models')

router.use(authToken)

router.post('/', async (req, res) => {
    try {
        const foundUser = await QuarantinedUser.findOne({ _id: req.user._id })
        if (!foundUser) return res.status(404).send('User not found')
        if (foundUser.quarantineLocation.latitude == 0 && foundUser.quarantineLocation.longitude == 0) return res.send('0')
        res.send('1')
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, statusCode: 'failed', message: 'Something went wrong', error: err })
    }
})

module.exports = router