if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const MongoDB = require('./db')

const app = express()
const port = process.env.PORT
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.set('view engine', 'ejs')
app.use(cors({
    "origin": "*",
    "methods": "GET,POST",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))
app.use(morgan('combined', { stream: accessLogStream }))
app.use(express.json())
app.use(express.static('public'))
app.use(express.static('uploads'))

app.use('/', require('./routes'))

app.listen(port, () => console.log(`${process.env.NODE_ENV !== 'production' ? 'Development' : 'Production'} server started on port ${port}...`))