const mongoose = require('mongoose')

const SensorDataSchema = new mongoose.Schema({
sensor: {
    type:String,
    required: true,
},
value:{
    type: String,
    required: true,
},
date_time:{
    type: Date,
    required: true
}
}, {
    timestamps: true
})

module.exports = mongoose.model('SensorData', SensorDataSchema)