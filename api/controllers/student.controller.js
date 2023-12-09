const Student = require('../models/student')
const StudentsByGroups = require('../models/studentsByGroups')
const service = require('../service/student.service')
const Quiz = require("../models/quiz");
const {getGroupId, teacherExists} = require("../service/student.service");
const Discipline = require("../models/discipline");
const {Op, QueryTypes} = require("sequelize");
const Teacher = require("../models/teacher");
const StudentCrudLoad = require("../models/student_crud_load");

// defines all the group members of current student
// RETURN:
//        [{}]
exports.getUserInfo = async (req, res) => {
    try {
        const student = await Student.findOne({
            logging: false,
            where: {
                id: req.user.id
            }
        })

        const students = await StudentsByGroups.findAll({
            logging: false,
            where: {
                groups: req.body.groups
            }
        })

        let surveys_passed = []
        if (student.dataValues.is_head_student) {
            for (const entry of students) {
                const surveysQuery = `SELECT discipline.name as discipline_name, discipline.id as discipline_id, quizzes.id as quiz_id, quizzes.student_id FROM \`quizzes\` join kaf307_2023.discipline on kaf307_2023.discipline.id = quizzes.discipline_id where quizzes.student_id = ${entry.dataValues.id}`
                const surveys = await Quiz.sequelize.query(surveysQuery, {
                    type: QueryTypes.SELECT,
                    logging: false
                })

                if (surveys.length !== 0) {
                    const student_id = entry.dataValues.id

                    surveys_passed = [service.fillSubmittedSurveys(student_id, surveys), ...surveys_passed]
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
            const student_id = student.dataValues.id
            surveys_passed = await service.getSurveysStudentPassed(student_id)

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
    const students = await Student.findAll({
        logging: false
    })

    res.status(200).json({
        students: students,
        statusCode: res.statusCode,
    })
}

exports.getDisciplines = async (req, res) => {
    try {
        const disciplines = await Discipline.findAll({
            attributes: ['id', 'name'],
            logging: false,
            where: {
                id: {
                    [Op.not]: 1,
                }
            }
        })

        res.status(200).json(disciplines)
    } catch (err) {
        res.status(500).json({
            message: 'Невозможно получить список дисциплин.',
            error: err.message,
            statusCode: res.statusCode
        })
    }
}

exports.getTeachers = async (req, res) => {
    // begin
    const student = await Student.findOne({
        where: {
            id: req.user.id
        }
    })

    if (!student || student.dataValues.is_head_student !== '1') {
        res.status(500).json({
            message: "Ошибка авторизации или пользователь не является старостой.",
            statusCode: res.statusCode,
        })

        return
    }
    // end
    try {
        const teachers = await Teacher.findAll({
            attributes: ['id', 'name', 'surname', 'patronymic'],
            logging: false
        })

        res.status(200).json(teachers)
    } catch (err) {
        res.status(500).json({
            message: 'Невозможно получить список преподавателей.',
            error: err.message,
            statusCode: res.statusCode
        })
    }
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

        const distributed_load = await service.applyDistributedLoad(semester, groups_id, 'kaf307_2023')

        const student_id = req.user.id
        const surveys_passed = await service.getSurveysStudentPassed(student_id)

        res.status(200).json({
            distributed_load: distributed_load,
            surveys_passed: surveys_passed,
        })
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

// inserts score scheme into db
exports.setTeacherScore = async (req, res, next) => {
    try {
        const body = req.body
        const [lecturer, seminarian] = await service.teacherExists(body)
        const queryYear = body[0].groups.split('-', 3)

        const date = new Date()
        const numberOfCourse = date.getFullYear() - 2000 - queryYear[2] + 1
        // const numberOfCourse = 2023 - 2000 - queryYear[2] + 1

        const groupName = queryYear[0] + '-' + numberOfCourse.toString() + queryYear[1] + '-' + queryYear[2]
        const groups_id = await getGroupId(groupName)

        let lecturer_score = 0
        let seminarian_score = 0
        for (let i = 1; i < 8; i++) {
            lecturer_score += Number(body[i].lecturer)
            seminarian_score += Number(body[i].seminarian)
        }

        const quizData = {
            lecturer_id: lecturer.id,
            seminarian_id: seminarian.id,
            lecturer_score: lecturer_score,
            seminarian_score: seminarian_score,
            lecturer_pros: body[8].lecturer,
            seminarian_pros: body[9].seminarian,
            lecturer_cons: body[10].lecturer,
            seminarian_cons: body[11].seminarian,
            student_id: body[0].student_id,
            discipline_id: body[0].discipline_id,
            group_id: groups_id,
        }

        await Quiz.create(quizData, {
            logging: false
        })

        res.status(201).json({
            message: 'Опрос сохранен.',
            statusCode: res.statusCode,
        })

    } catch (err) {
        res.status(400).json({message: err.stack})
    }
}

exports.updateTeacher = async (req, res) => {
    try {
        const [distributed_load, teacher] = await service.updateTeacherCheckBody(req.body)

        if (!teacher || !distributed_load) {
            res.status(400).json({
                message: 'Неизвестный преподаватель или не получается получить распределение нагрузки.',
                statusCode: res.statusCode
            })

            return
        }

        try {
                const id = distributed_load.dataValues.id
                const teacher_id = teacher.dataValues.id

                const obj = {
                    id: id,
                    practical: req.body.practical,
                    lectures: req.body.lectures,
                    teacher_name: teacher.dataValues.name,
                    teacher_surname: teacher.dataValues.surname,
                    teacher_patronymic: teacher.dataValues.patronymic,
                    laboratory: req.body.laboratory,
                    teacher_id: teacher_id,
                    semester: req.body.semester,
                    group_id: req.body.group_id,
                    group_name: req.body.group_name,
                }

                await StudentCrudLoad.update(obj, {
                    where: {
                        id: id
                    }
                })

                res.status(200).json({
                    message: "Информация обновлена успешно",
                    statusCode: res.statusCode,
                })
        } catch (err) {
            res.status(400).json({
                statusCode: res.statusCode,
                message: "Неверный формат данных.",
                error: err.message,
            })
        }
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            error: err.message,
            message: 'Не получилось обновить информацию.'
        })
    }
}

exports.provideDistributedLoad = async (req, res) => {
    const student_id = req.user.id
    const surveys_passed = await service.getSurveysStudentPassed(student_id)
    const queryYear = req.query.groups.split('-', 3)

    const date = new Date()
    const numberOfCourse = date.getFullYear() - 2000 - queryYear[2] + 1
    // const numberOfCourse = 2023 - 2000 - queryYear[2] + 1
    const semester = date.getMonth() > 1 ? 0 : 1

    const groupName = queryYear[0] + '-' + numberOfCourse.toString() + queryYear[1] + '-' + queryYear[2]

    try {
        const groups_id = await getGroupId(groupName)
        const distributed_load = await StudentCrudLoad.findAll({
            where: {
                group_name: groupName,
                group_id: groups_id,
                semester: semester,
            }
        })

        const check = service.getCrudDistributedLoad(distributed_load)

        res.status(200).json({
            distributed_load: check,
            surveys_passed: surveys_passed,
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            message: err.message,
            statusCode: res.statusCode,
        })
    }

}

exports.createDiscipline = async (req, res) => {
    const userRequest = {
        discipline_name: req.body.discipline_name,
        teacher_surname: req.body.teacher_surname,
        teacher_name: req.body.teacher_name,
        teacher_patronymic: req.body.teacher_patronymic,
        group_id: req.body.group_id,
        group_name: req.body.group_name,
        semester: req.body.semester,
        lectures: req.body.lectures,
        practical: req.body.practical,
        laboratory: req.body.laboratory
    }

    try {
        const dataExists = await StudentCrudLoad.findOne({
            where: {
                discipline_name: req.body.discipline_name,
                teacher_surname: req.body.teacher_surname,
                teacher_name: req.body.teacher_name,
                teacher_patronymic: req.body.teacher_patronymic,
                group_id: req.body.group_id,
                group_name: req.body.group_name,
                semester: req.body.semester,
                lectures: req.body.lectures,
                practical: req.body.practical,
                laboratory: req.body.laboratory
            }
        })

        if (dataExists) {
            res.status(400).json({
                message: 'Такая дисциплина уже существует.',
                statusCode: res.statusCode
            })

            return
        }

        const teacher = await Teacher.findOne({
            where: {
                surname: req.body.teacher_surname,
                name: req.body.teacher_name,
                patronymic: req.body.teacher_patronymic,
            }
        })

        if (!teacher) {
            res.status(400).json({
                message: 'Такой преподаватель не существует.',
                statusCode: res.statusCode
            })

            return
        }

        let discipline = await Discipline.findOne({
            where: {
                name: userRequest.discipline_name
            }
        })

        if (!discipline) {
            await Discipline.create({
                name: userRequest.discipline_name,
                comment: '',
            })

            discipline = await Discipline.findOne({
                where: {
                    name: userRequest.discipline_name
                }
            })

            userRequest.discipline_id = discipline.dataValues.id
            userRequest.teacher_id = teacher.dataValues.id

            await StudentCrudLoad.create(userRequest)

            res.status(201).json({
                message: "Учебная дисциплина успешно создана.",
                statusCode: res.statusCode
            })
        }

        userRequest.discipline_id = discipline.dataValues.id
        userRequest.teacher_id = teacher.dataValues.id

        await StudentCrudLoad.create(userRequest)

        res.status(201).json({
            message: "Учебная дисциплина успешно создана.",
            statusCode: res.statusCode
        })
    } catch (err) {
        res.status(400).json({
            message: 'Не получается найти данные.',
            statusCode: res.statusCode,
        })

        return
    }
}