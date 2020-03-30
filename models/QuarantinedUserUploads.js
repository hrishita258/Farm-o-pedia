const mongoose = require('mongoose')

const QuarantinedUserUploadSchema = new mongoose.Schema({
    _quarantinedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    uploadType: {
        type: String,
        required: true
    },
    location: {
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        }
    },
    image: String,
    voiceNote: String,
    text: String
}, {
    timestamps: true
})

module.exports = mongoose.model('QuarantinedUserUpload', QuarantinedUserUploadSchema)