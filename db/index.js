if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const mongoose = require('mongoose')

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log(err))

module.exports = mongoose.connection