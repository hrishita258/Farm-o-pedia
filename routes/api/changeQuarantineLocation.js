const express = require('express')

const { QuarantinedUser } = require('../../models')
const { authToken } = require('../../middlewares')

const router = express.Router()

router.use(authToken)

router.post('/', async (req, res) => {
    if (!req.body.latitude || !req.body.longitude) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'latitude and longitude are required' })
    const foundUser = await QuarantinedUser.findOne({ _id: req.user._id })
    if (!foundUser) return res.status(404).json({ status: 404, message: 'Not Found' })
    if (foundUser.quarantineLocation.latitude != 0 && foundUser.quarantineLocation.longitude != 0) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'You cannot change quarantine location' })
    foundUser.quarantineLocation.latitude = req.body.latitude
    foundUser.quarantineLocation.longitude = req.body.longitude
    try {
        foundUser.save()
        res.json({ status: 200, statusCode: 'success', message: 'Qurantine Location updated successfully' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, statusCode: 'failed', message: 'Something went wrong', error: err })
    }

})

module.exports = router