const mongoose = require('mongoose')

const UserOutOfAreaSchema = new mongoose.Schema({
    _quarantinedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    path: [
        {
            latitude: Number,
            longitude: Number,
            date: Date
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('UserOutOfArea', UserOutOfAreaSchema)