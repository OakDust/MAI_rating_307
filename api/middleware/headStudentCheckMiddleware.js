const StudentsByGroups = require("../models/studentsByGroups");
module.exports = function checkHeadStudent() {
    return async function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }
        const userId = req.user.id
        const dbUserId = await StudentsByGroups.findOne({
            attributes: ['id', 'is_head_student'],
            where: {
                id: userId
            }
        })

        if (dbUserId.dataValues.is_head_student !== '1') {
            res.status(403).json({
                message: "Недостаточно прав для операции.",
                statusCode: res.statusCode,
            })
            return
        }

        next()
    }

}