const Student = require('../models/student')
const StudentsByGroups = require('../models/studentsByGroups')


exports.getUserInfo = async (req, res) => {

  const students = await StudentsByGroups.findAll({
    where: {
      groups: req.body.groups
    }
  })

  const output = JSON.stringify(students, null, 2)
  await res.status(200).json(students)
}

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

  return headStudent
}