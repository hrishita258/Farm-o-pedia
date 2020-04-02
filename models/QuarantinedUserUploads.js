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
            }
        }
    ],
    images: [{
        url: String
    }],
    voiceNotes: [{
        url: String
    }],
    texts: [{
        text: String
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('QuarantinedUserUpload', QuarantinedUserUploadSchema)