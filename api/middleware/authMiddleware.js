const jwt = require('jsonwebtoken')

module.exports = function authenticateToken(req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }
    const authParam = req.query['Authorization']

    const token = authParam && authParam.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.AUTH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}