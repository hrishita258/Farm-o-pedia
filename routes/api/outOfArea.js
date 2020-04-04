const express = require('express')

const router = express.Router()

const { authToken } = require('../../middlewares')
const { userOutOfArea, QuarantinedUser } = require('../../models')

router.use(authToken)

const degree2radian = degree => {
    return degree * (Math.PI / 180)
}

const calculateDistanceHaversine = (latitude1, longitude1, latitude2, longitude2) => {
    let radius = 6371
    let dLat = degree2radian(latitude2 - latitude1)
    let dLng = degree2radian(longitude2 - longitude1)
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(degree2radian(latitude1)) * Math.cos(degree2radian(latitude2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    let d = radius * c
    return d
}

router.get('/', (req, res) => {
    res.status(400).json({ status: 400, message: 'Send post request to this api' })
})

router.post('/', async (req, res) => {
    let { latitude, longitude } = req.body
    if (!latitude || !longitude) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'latitude and longitude are required' })
    const user = await QuarantinedUser.findOne({ _id: req.user._id })
    if (!user) return res.status(404).json({ status: 404, statusCode: 'failed', message: 'User not found' })
    const distance = calculateDistanceHaversine(user.quarantineLocation.latitude, user.quarantineLocation.longitude, latitude, longitude)
    if (distance <= 0.030) return res.status(200).send('Not out of Area')
    let date = new Date()
    let obj = {
        latitude, longitude, date
    }
    let date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
    let date2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0)
    const result = await userOutOfArea.findOne({
        _quarantinedUserId: req.user._id,
        createdAt: {
            $gte: date1,
            $lt: date2
        }
    })
    if (result) {
        try {
            await userOutOfArea.updateOne({
                _id: result._id
            }, {
                $push: {
                    path: obj
                }
            })
            res.status(400).send('User out of area')
        } catch (err) {
            console.log(err)
            res.status(500).json({ status: 500, statusCode: 'failed', message: 'Something went wrong', error: err })
        }
    } else {
        try {
            await userOutOfArea.create({
                _quarantinedUserId: req.user._id,
                user: {
                    name1: req.user.name1,
                    name2: req.user.name2,
                    phoneNumber1: req.user.phoneNumber1,
                    phoneNumber2: req.user.phoneNumber2,
                    age: req.user.age,
                    gender: req.user.gender,
                    block: req.user.block,
                    detectedCity: req.user.detectedCity,
                    detectedState: req.user.detectedState,
                    address: req.user.address
                },
                path: [obj]
            })
            res.status(400).send('User out of area')
        } catch (err) {
            console.log(err)
            res.status(500).json({ status: 500, statusCode: 'failed', message: 'Something went wrong', error: err })
        }
    }
})

module.exports = router