const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

const { authToken } = require('../../middlewares')
const { QuarantinedUser } = require('../../models')

router.use(authToken)

router.get('/', (req, res) => {
    res.status(400).json({ status: 400, message: 'Send post request to this api' })
})

router.post('/', async (req, res) => {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'oldPassword and newPassword is required' })
    if (newPassword.length < 6) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'New password should be more than 6 characters' })
    let foundUser
    try {
        foundUser = await QuarantinedUser.findOne({ _id: req.user._id })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: 500, statusCode: 'failed', message: 'Something went wrong', error: err })
    }
    if (!foundUser) return res.status(404).json({ status: 404, statusCode: 'failed', message: 'User not found' })
    const isMatch = await bcrypt.compare(oldPassword, foundUser.password)
    if (!isMatch) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'Old password is incorrect' })
    if (newPassword == oldPassword) return res.status(400).json({ status: 400, statusCode: 'failed', message: 'newPassword cannot be same as oldPassword' })
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    try {
        foundUser.password = hashedPassword
        await foundUser.save()
        res.json({ status: 200, statusCode: 'success', message: 'Password changed successfully' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: 500, statusCode: 'failed', message: 'Something went wrong', error: err })
    }
})

module.exports = router