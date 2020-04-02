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
            timestamp: {
                type: Date,
            }
        }
    ],
    images: [{
        url: String,
        timestamp: Date
    }],
    voiceNotes: [{
        url: String,
        timestamp: Date
    }],
    texts: [{
        text: String,
        timestamp: Date
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('QuarantinedUserUpload', QuarantinedUserUploadSchema)