const mongoose = require('mongoose')

const QuarantinedUserUploadSchema = new mongoose.Schema({
    _quarantinedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    locations: [
        {
            latitude: {
                type: Number,
            },
            longitude: {
                type: Number,
            },
            date: Date
        }
    ],
    images: [{
        url: String,
        date: Date
    }],
    voiceNotes: [{
        url: String,
        date: Date
    }],
    texts: [{
        text: String,
        date: Date
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('QuarantinedUserUpload', QuarantinedUserUploadSchema)