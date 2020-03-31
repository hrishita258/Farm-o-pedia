module.exports = (req, res, next) => {
    if (req.user.role != 1) {
        req.logout()
        req.flash('error', 'You dont have enough rights to view that thing')
        return res.redirect('/login')
    }
    next()
}