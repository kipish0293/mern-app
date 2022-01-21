const config = require('config')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    if(req.method === "OPTIONS") {
        return next()
    }

    try {
        const token = req.headers.authorisation.split(' ')[1]

        if(!token) {
            return res.status(401).json({message : "Нет авторизации"})
        }

        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded

        next()

    } catch (e) {
        return res.status(401).json({message : "Нет авторизации"})
    }
}