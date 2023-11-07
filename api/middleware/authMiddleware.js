module.exports = function(req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        const token = req.header['Authorization'].split(' ')[1]

        if (!token) {

        }
    } catch (error) {
        res.status(401).json({message: "Не пройдена авторизация"})
    }
}