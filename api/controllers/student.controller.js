const Student = require('../models/student')


exports.show = async (req, res) => {
  const students = await Student.findAll()

  const output = JSON.stringify(students, null, 2)

  res.status(200).json(students)
}

exports.checkHeadStudent = async () => {
  const headStudent = await Student.findAll({
    where: {
      is_head_student: true
    }
  })

  // console.log("Head student:", JSON.stringify(headStudent, null, 2));

  return headStudent
}