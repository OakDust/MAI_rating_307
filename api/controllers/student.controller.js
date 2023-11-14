const Student = require('../models/student')
const StudentsByGroups = require('../models/studentsByGroups')
const service = require('../service/student.service')
const Quiz = require("../models/quiz");


// defines all the group members of current student
// RETURN:
//        [{}]
exports.getUserInfo = async (req, res) => {
  try {
    const students = await StudentsByGroups.findAll({
      where: {
        groups: req.body.groups
      }
    })

    await res.status(200).json(students)
  } catch (err) {
    res.status(400).json({message: err.stack})
  }
}

// will need this later ~no-use
exports.show = async (req, res) => {
  const students = await Student.findAll()
  
  res.status(200).json(students)
}

// finds entries of teachers in group curriculum
// RETURN:
//     [{key: i,
//     lecturer: array[i].lecturer,
//     seminarian: array[i].seminarian,
//     discipline: array[i].discipline,
//     groups: array[i].groups}]
exports.fetchDisciplines = async (req, res) => {
  try {
    const requestHeaders = {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/html",

      },
      body: {
        "username": process.env.DISCIPLINE_API_USERNAME,
        "password": process.env.DISCIPLINE_API_PASSWORD
      }
    }

    let response
    await fetch(process.env.FETCH_DISCIPLINES_API_URL, requestHeaders)
        .then((res) => res.text())
        .then((text) => {
          response = text
        })

    const [links, parsed] = service.parseTable(response)
    const toMerge = parsed.filter(val => val.length !== 0 && val.length !== '')

    const professorsLoad = []

    for (let i = 0; i < links.length; i++) {
      const load = await service.getObject(req, res, links[i])
      professorsLoad.push(load)
    }

    const pretty = service.prettyArray(toMerge, professorsLoad)

    const dataByGroup = service.sortDataByGroup(req.query.groups, pretty)

    res.status(200).json(dataByGroup)

  } catch (err) {
    res.status(500).json({message: err.stack})
  }
}

// inserts score scheme into db
exports.setTeacherScore = async (req, res, next) => {
  try {
    const [lecturer, seminarian] = await service.teacherExists(req.body)

    let lecturer_score = 0
    let seminarian_score = 0
    for (let i = 3; i < 9; i++) {
      lecturer_score += Number(req.body[i].lecturer)
      seminarian_score += Number(req.body[i].seminarian)
    }

    const quizData = {
      lecturer_id: lecturer.id,
      seminarian_id: seminarian.id,
      lecturer_score: lecturer_score,
      seminarian_score: seminarian_score,
      lecturer_pros: req.body[9].lecturer,
      seminarian_pros: req.body[10].seminarian,
      lecturer_cons: req.body[11].lecturer,
      seminarian_cons: req.body[12].seminarian,
    }

    await Quiz.create(quizData)
      .then(res.status(200).end())
      .catch((err) => {
        if (err) {
          res.status(500).json({message: err.stack})
        }
      })

  } catch (err) {
    res.status(400).json({message: err.stack})
  }
}