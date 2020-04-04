const mongoose = require('mongoose')

const UserOutOfAreaSchema = new mongoose.Schema({
    _quarantinedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user: {
        name1: String,
        name2: String,
        phoneNumber1: Number,
        phoneNumber2: Number,
        age: Number,
        gender: String,
        block: String,
        detectedCity: String,
        detectedState: String,
        address: String
    },
    path: [
        {
            latitude: Number,
            longitude: Number,
            date: Date
        }
    ],
    reason: String
}, {
    timestamps: true
})

module.exports = mongoose.model('UserOutOfArea', UserOutOfAreaSchema)