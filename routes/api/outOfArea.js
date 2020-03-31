const express = require('express')

const router = express.Router()

const { authToken } = require('../../middlewares')
const { userOutOfArea } = require('../../models')

router.use(authToken)

router.get('/', (req, res) => {
    res.status(400).json({ status: 400, message: 'Send post request to this api' })
})

router.post('/', async(req, res) => {
    if (!req.body.length) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'body must be an array of objects' })
    for (let i = 0; i < req.body.length; i++)
        if (!req.body[i].latitude || !req.body[i].longitude || !req.body[i].date) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'Each object must contain latitude, longitude and date fields' })
    let date = new Date()
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
                    path: {
                        $each: req.body
                    }
                }
            })
            res.status(201).json({ status: 201, statusCode: 'success', message: 'Location added successfully' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ status: 500, statusCode: 'failed', message: 'Something went wrong', error: err })
        }
    } else {
        try {
            await userOutOfArea.create({
                _quarantinedUserId: req.user._id,
                path: [...req.body]
            })
            res.status(201).json({ status: 201, statusCode: 'success', message: 'Location added successfully' })
        } catch (err) {
            console.log(err)
            res.status(500).json({ status: 500, statusCode: 'failed', message: 'Something went wrong', error: err })
        }
    }
})

module.exports = router