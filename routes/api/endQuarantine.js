const express = require('express')

const router = express.Router()

const { authToken } = require('../../middlewares')
const { QuarantinedUser } = require('../../models')

router.use(authToken)

router.get('/', (req, res) => {
    res.status(400).json({ status: 400, message: 'Send post request to this api' })
})

router.post('/', async (req, res) => {
    const foundUser = await QuarantinedUser.findOne({ _id: req.user._id })
    if (!foundUser) return res.status(404).json({ status: 404, statusCode: 'failed', message: 'User not found' })
    if (foundUser.quarantineEndAt) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'Quarantine already has been ended' })
    let date = new Date()
    foundUser.quarantineEndAt = date
    try {
        await foundUser.save()
        res.status(200).json({ status: 200, statusCode: 'success', message: 'Quarantine ended successfully' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, statusCode: 'failed', message: 'Something went wrong', error: err })
    }
})

module.exports = router