if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoDBStore = require('connect-mongo')(session)
const flash = require('express-flash')
const passport = require('passport')

const MongoDB = require('./db')
const { initializePassport } = require('./passport')
const { checkUserNotAuthenticated } = require('./middlewares')

initializePassport(passport)

const app = express()
const port = process.env.APP_PORT

app.set('view engine', 'ejs')
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
app.use(passport.initialize())
app.use(passport.session())

app.get('/login', checkUserNotAuthenticated, (req, res) => {
    res.render('login')
})

app.post('/login', checkUserNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.use('/', require('./routes/dashboardRoutes'))

app.post('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

app.listen(port, () => console.log(`${process.env.NODE_ENV !== 'production' ? 'Development' : 'Production'} app started on port ${port}...`))