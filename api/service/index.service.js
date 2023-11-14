const Student = require("../models/student");


exports.checkHeadStudent = async (req) => {
    const groupmates = await Student.findAll({
        where: {
            groups: req.body.groups
        }
    })

    let headStudent = false

    for (const student of groupmates) {
        if (student.dataValues.is_head_student) {
            headStudent = true
            break
        }
    }

    return headStudent
}
