if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')

const MongoDB = require('./db')

const app = express()
const port = process.env.APP_PORT

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(express.static('uploads'))

app.use('/', require('./routes/dashboardRoutes'))

app.listen(port, () => console.log(`${process.env.NODE_ENV !== 'production' ? 'Development' : 'Production'} app started on port ${port}...`))