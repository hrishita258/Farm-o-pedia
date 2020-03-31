const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const { User } = require('../models')

const initializePassport = passport => {
    const authenticateUser = async (email, password, done) => {
        const foundUser = await User.findOne({ email })
        if (!foundUser) return done(null, false, { message: 'User not found' })
        if (await bcrypt.compare(password, foundUser.password)) return done(null, foundUser)
        else return done(null, false, { message: 'Password is incorrect' })
    }
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, JSON.stringify(user)))
    passport.deserializeUser((user, done) => done(null, JSON.parse(user)))
}

module.exports = initializePassport