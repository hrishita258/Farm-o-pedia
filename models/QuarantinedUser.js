const mongoose = require('mongoose')

const QuarantinedUserSchema = new mongoose.Schema({
    name1: {
        type: String,
        required: true
    },
    name2: {
        type: String,
        required: true
    },
    phoneNumber1: {
        type: Number,
        required: true,
        unique: true
    },
    phoneNumber2: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dateAnnounced: {
        type: Date,
        required: true
    },
    currentStatus: {
        type: String,
        required: true
    },
    detectedCity: {
        type: String,
        required: true
    },
    block: {
        type: String,
        required: true
    },
    detectedState: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    registrationLocation: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    quarantineLocation: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    travelHistory: {
        route: {
            type: String
        },
        travelType: {
            type: String
        },
        date: {
            type: Date
        }
    },
    password: {
        type: String,
        required: true
    },
    fever: Number,
    cough: Number,
    breathing: Number,
    quarantineEndAt: Date
}, {
    timestamps: true
})

module.exports = mongoose.model('QuarantinedUser', QuarantinedUserSchema)