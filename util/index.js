const randomString = n => {
    let text = ''
    let length = n
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
    return text
}

module.exports = {
    randomString
}