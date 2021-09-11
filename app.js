if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const cors = require('cors')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoDBStore = require('connect-mongo')(session)
const flash = require('express-flash')

const MongoDB = require('./db')

const app = express()
const port = process.env.APP_PORT

app.set('view engine', 'ejs')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(flash())
app.use(session({
    secret: 'secret',
    store: new MongoDBStore({ mongooseConnection: MongoDB }),
    resave: false,
    saveUninitialized: false
}))


app.use('/', require('./routes/dashboardRoutes'))


app.listen(port, () => console.log(`${process.env.NODE_ENV !== 'production' ? 'Development' : 'Production'} app started on port ${port}...`))