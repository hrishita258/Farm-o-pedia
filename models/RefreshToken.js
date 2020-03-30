const mongoose = require('mongoose')

const RefreshTokenSchema = new mongoose.Schema({
    _quarantinedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema)