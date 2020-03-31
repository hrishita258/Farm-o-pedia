const mongoose = require('mongoose')

const DashboardUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    block: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('DashboardUser', DashboardUserSchema)