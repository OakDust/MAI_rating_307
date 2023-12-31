const Student = require('../models/student')
const StudentsByGroups = require('../models/studentsByGroups')
const service = require('../service/student.service')
const Quiz = require("../models/quiz");
const {getGroupId} = require("../service/student.service");

// defines all the group members of current student
// RETURN:
//        [{}]
exports.getUserInfo = async (req, res) => {
    try {
        const student = await Student.findOne({
            where: {
                id: req.user.id
            }
        })

        const students = await StudentsByGroups.findAll({
            where: {
                groups: req.body.groups
            }
        })

        let surveys_passed = []
        if (student.dataValues.is_head_student) {
            for (const entry of students) {
                const surveys = await Quiz.findAll({
                    where: {
                        student_id: entry.dataValues.id
                    }
                })

                if (surveys.length !== 0) {
                    surveys_passed = [service.fillSubmittedSurveys(surveys, entry), ...surveys_passed]
                } else {
                    surveys_passed.push({
                        student_id: entry.dataValues.id,
                        submitted_surveys: 0
                    })
                }
            }
            res.status(200).json({
                surveys_passed: surveys_passed,
                students: students,
            })
        } else {
            surveys_passed = await service.getSurveysStudentPassed(student)

            res.status(200).json({
                surveys_passed: surveys_passed,
                students: students,
            })
        }

    } catch (err) {
        res.status(400).json({
            message: err.stack,
            statusCode: res.statusCode,
        })
    }
}

// will need this later ~no-use
exports.show = async (req, res) => {
    const students = await Student.findAll()

    res.status(200).json({
        students: students,
        statusCode: res.statusCode,
    })
}

exports.getDistributedLoad = async (req, res) => {
    try {
        // to set the group course correctly
        const queryYear = req.query.groups.split('-', 3)

        const date = new Date()
        const numberOfCourse = date.getFullYear() - 2000 - queryYear[2] + 1
        // const numberOfCourse = 2023 - 2000 - queryYear[2] + 1
        const semester = date.getMonth() > 1 ? 0 : 1

        const groupName = queryYear[0] + '-' + numberOfCourse.toString() + queryYear[1] + '-' + queryYear[2]

        const groups_id = await getGroupId(groupName)

        const distributed_load = await service.applyDistributedLoad(semester, groups_id)

        const student = await Student.findOne({
            where: {
                id: req.user.id
            }
        })
        const surveys_passed = await service.getSurveysStudentPassed(student)

        res.status(200).json({
            distributed_load: distributed_load,
            surveys_passed: surveys_passed,
        })
    } catch (err) {
        res.status(500).json({message: err.message})
    }
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
        const queryYear = req.body[0].groups.split('-', 3)

        const date = new Date()
        const numberOfCourse = date.getFullYear() - 2000 - queryYear[2] + 1
        // const numberOfCourse = 2023 - 2000 - queryYear[2] + 1

        const groupName = queryYear[0] + '-' + numberOfCourse.toString() + queryYear[1] + '-' + queryYear[2]
        const groups_id = await getGroupId(groupName)

        let lecturer_score = 0
        let seminarian_score = 0
        for (let i = 1; i < 8; i++) {
            lecturer_score += Number(req.body[i].lecturer)
            seminarian_score += Number(req.body[i].seminarian)
        }

        const quizData = {
            lecturer_id: lecturer.id,
            seminarian_id: seminarian.id,
            lecturer_score: lecturer_score,
            seminarian_score: seminarian_score,
            lecturer_pros: req.body[8].lecturer,
            seminarian_pros: req.body[9].seminarian,
            lecturer_cons: req.body[10].lecturer,
            seminarian_cons: req.body[11].seminarian,
            student_id: req.body[0].student_id,
            discipline_id: req.body[0].discipline_id,
            group_id: groups_id,
        }

        await Quiz.create(quizData)

        res.status(200).json({message: 'Saved'})

    } catch (err) {
        res.status(400).json({message: err.stack})
    }
}