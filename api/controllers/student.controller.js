const Student = require('../models/student')
const StudentsByGroups = require('../models/studentsByGroups')
const service = require('../service/student.service')
const Quiz = require("../models/quiz");
const {getGroupId, teacherExists} = require("../service/student.service");
const Discipline = require("../models/discipline");
const {Op, QueryTypes} = require("sequelize");
const Teacher = require("../models/teacher");
const StudentCrudLoad = require('../models/student_crud_load');
const English = require("../models/english");
const Individual = require("../models/individual");

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
                const quizzes = process.env.CURRENT_YEAR_QUIZZES
                const currentDB = process.env.DB_NAME
                // const currentYearDB = process.env.CURRENT_DB_CONFIG
                const currentYearDB = process.env.DB_NAME

                const surveysQuery = `SELECT ${currentYearDB}.discipline.name as discipline_name, ${currentYearDB}.discipline.id as discipline_id, ${currentDB}.${quizzes}.id as quiz_id, ${currentDB}.${quizzes}.student_id FROM \`${currentDB}\`.\`${quizzes}\` join ${currentYearDB}.discipline on ${currentYearDB}.discipline.id = ${currentDB}.${quizzes}.discipline_id where ${currentDB}.${quizzes}.student_id = ${entry.dataValues.id}`

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

    if (!student || !student.dataValues.is_head_student) {
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
        // const numberOfCourse = date.getFullYear() - 2000 - queryYear[2] + 1
        // const numberOfCourse = 2023 - 2000 - queryYear[2] + 1

        let numberOfCourse = 0
        if (process.env.CURRENT_YEAR_CRUD_DB === 'load_22') {
            numberOfCourse = process.env.CURRENT_YEAR % 2000 - queryYear[2] + 1
        } else if (process.env.CURRENT_YEAR_CRUD_DB === 'student_crud_load') {
            numberOfCourse = date.getFullYear() - 2000 - queryYear[2]
        } else {
            res.status(500).json({
                message: 'DB initialization error. Check .env',
                statusCode: res.statusCode
            })

            return
        }

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
            info: body[0].info,
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
    const group_name = req.body.group_name.split('-', 3)
    req.body.group_name = group_name[0] + '-' + group_name[1].at(1) + group_name[1].at(2) + group_name[1].at(3) + '-' + group_name[2]

    const [groupName, semester] = await service.getUserGroupById(req, res)
    const groupId = await service.getGroupId(groupName)

    req.body.semester = semester
    req.body.group_id = groupId
    req.body.group_name = groupName

    const [distributed_load, teacher] = await service.updateTeacherCheckBody(req.body)

    if (!teacher || !distributed_load) {
        res.status(400).json({
            message: 'Неизвестный преподаватель или не получается получить распределение нагрузки.',
            statusCode: res.statusCode
        })

        return
    }

    const checkDisciplineInDB = await StudentCrudLoad.findOne({
        where: {
            discipline_id: req.body.discipline_id
        }
    })

    if (!checkDisciplineInDB) {
        res.status(400).json({
            message: "Невозможно найти указанную учебную дисциплину.",
            statusCode: res.statusCode
        })

        return
    }

    try {
        const id = distributed_load.dataValues.id
        const teacher_id = teacher.dataValues.id
        const discipline_name = checkDisciplineInDB.dataValues.discipline_name

        const obj = {
            id: id,
            practical: req.body.practical,
            lectures: req.body.lectures,
            teacher_name: teacher.dataValues.name,
            teacher_surname: teacher.dataValues.surname,
            teacher_patronymic: teacher.dataValues.patronymic,
            discipline_name: discipline_name,
            laboratory: req.body.laboratory,
            teacher_id: teacher_id,
            semester: semester,
            group_id: groupId,
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
}

exports.provideDistributedLoad = async (req, res) => {
    const student_id = req.user.id
    const surveys_passed = await service.getSurveysStudentPassed(student_id)

    const [groupName, semester] = await service.getUserGroupById(req, res)
    try {
        const groups_id = await getGroupId(groupName)

        const distributed_load = await StudentCrudLoad.findAll({
            attributes: ['discipline_id'],
            where: {
                // group_name: groupName,
                group_id: groups_id,
                semester: semester,
            }
        })

        const load = await service.getCrudDistributedLoad(groups_id, semester, distributed_load)

        const working_semester = await service.appendChainsAndElectives(req)

        // load.push({
        //     lecturer,
        //     seminarian,
        //     discipline_id: disciplineId,
        //     discipline: entries[0].discipline_name,
        //     lecturer_id,
        //     seminarian_id,
        //     key,
        // })

        if (working_semester >= 4) {
            load.push(
                {
                    lecturer: '',
                    seminarian: '',
                    discipline_id: -1,
                    discipline: 'Цепочка 1',
                    lecturer_id: -1,
                    seminarian_id: -1,
                    key: 0
                },
                {
                    lecturer: '',
                    seminarian: '',
                    discipline_id: -1,
                    discipline: 'Цепочка 2',
                    lecturer_id: -1,
                    seminarian_id: -1,
                    key: 0
                }
            )
        }

        if (working_semester == 5 || working_semester == 6) {
            load.push(
                {
                    lecturer: '',
                    seminarian: '',
                    discipline_id: -1,
                    discipline: 'Электив 1',
                    lecturer_id: -1,
                    seminarian_id: -1,
                    key: 0
                }
            )
        } else if (working_semester == 7) {
            load.push(
                {
                    lecturer: '',
                    seminarian: '',
                    discipline_id: -1,
                    discipline: 'Электив 1',
                    lecturer_id: -1,
                    seminarian_id: -1,
                    key: 0
                },
                {
                    lecturer: '',
                    seminarian: '',
                    discipline_id: -1,
                    discipline: 'Электив 2',
                    lecturer_id: -1,
                    seminarian_id: -1,
                    key: 0
                }
            )
        }

        res.status(200).json({
            distributed_load: load,
            surveys_passed: surveys_passed,
        })
    } catch (err) {
        res.status(400).json({
            message: err.stack,
            statusCode: res.statusCode,
        })
    }

}

// exports.createDiscipline = async (req, res) => {
//     const group_name = req.body.group_name.split('-', 3)
//
//     req.body.group_name = group_name[0] + '-' + group_name[1].at(1) + group_name[1].at(2) + group_name[1].at(3) + '-' + group_name[2]
//
//     const [groupName, semester] = await service.getUserGroupById(req, res)
//     req.body.group_name = groupName
//     const groupId = await service.getGroupId(groupName)
//
//     req.body.group_id = groupId
//
//     const userRequest = {
//         discipline_name: req.body.discipline_name,
//         group_name: groupName,
//         group_id: groupId,
//         semester: semester,
//         lectures: req.body.lectures,
//         practical: req.body.practical,
//         laboratory: 0
//     }
//
//     const dataExist = await StudentCrudLoad.findAll({
//         raw: true,
//         where: {
//             discipline_name: req.body.discipline_name,
//             group_name: groupName,
//             semester: semester,
//             lectures: req.body.lectures,
//             practical: req.body.practical
//         }
//     })
//
//     if (dataExist.length === 1) {
//         res.status(400).json({
//             message: 'Такая учебная дисциплина уже в списке. Обновите информацию.',
//             statusCode: res.statusCode,
//         })
//
//         return
//     }
//
//     try {
//         let teacher = await Teacher.findOne({
//             logging: false,
//             where: {
//                 surname: req.body.teacher_surname,
//                 name: req.body.teacher_name,
//                 patronymic: req.body.teacher_patronymic,
//             }
//         })
//
//         let discipline = await Discipline.findOne({
//             logging: false,
//             where: {
//                 name: req.body.discipline_name
//             }
//         })
//
//         if (!teacher || !discipline) {
//             if (!discipline) {
//                 await Discipline.create({
//                     name: req.body.discipline_name,
//                     comment: '',
//                 })
//
//                 discipline = await Discipline.findOne({
//                     where: {
//                         name: req.body.discipline_name,
//                     }
//                 })
//             }
//
//             if (!teacher) {
//                 await Teacher.create({
//                     surname: req.body.teacher_surname,
//                     name: req.body.teacher_name,
//                     patronymic: req.body.teacher_patronymic,
//                 })
//
//                 teacher = await Teacher.findOne({
//                     logging: false,
//                     where: {
//                         surname: req.body.teacher_surname,
//                         name: req.body.teacher_name,
//                         patronymic: req.body.teacher_patronymic,
//                     }
//                 })
//             }
//         }
//
//
//         userRequest.discipline_id = discipline.dataValues.id
//         userRequest.discipline_name = discipline.dataValues.name
//         userRequest.teacher_id = teacher.dataValues.id
//         userRequest.teacher_name = teacher.dataValues.name
//         userRequest.teacher_surname = teacher.dataValues.surname
//         userRequest.teacher_patronymic = teacher.dataValues.patronymic
//
//         await StudentCrudLoad.create(userRequest)
//
//         res.status(201).json({
//             message: "Учебная дисциплина успешно создана.",
//             statusCode: res.statusCode
//         })
//
//         return
//     } catch (err) {
//         res.status(400).json({
//             message: 'Не получается найти данные.',
//             statusCode: res.statusCode,
//         })
//
//         return
//     }
// }

exports.createDiscipline = async (req, res) => {
    try {
        const group_name = req.body.group_name.split('-')
        req.body.group_name = group_name[0] + '-' + group_name[1].charAt(1) + group_name[1].charAt(2) + group_name[1].charAt(3) + '-' + group_name[2]

        const [groupName, semester] = await service.getUserGroupById(req, res)
        req.body.group_name = groupName
        const groupId = await service.getGroupId(groupName)

        req.body.group_id = groupId

        const userRequest = {
            discipline_name: req.body.discipline_name,
            group_name: groupName,
            group_id: groupId,
            semester: semester,
            lectures: req.body.lectures,
            practical: req.body.practical,
            laboratory: 0
        }

        const dataExist = await StudentCrudLoad.findAll({
            raw: true,
            where: {
                discipline_name: req.body.discipline_name,
                group_name: groupName,
                semester: semester,
                lectures: req.body.lectures,
                practical: req.body.practical
            }
        })

        if (dataExist.length === 1) {
            res.status(400).json({
                message: 'Такая учебная дисциплина уже в списке. Обновите информацию.',
                statusCode: res.statusCode,
            })

            return
        }

        let teacher = await Teacher.findOne({
            logging: false,
            where: {
                surname: req.body.teacher_surname,
                name: req.body.teacher_name,
                patronymic: req.body.teacher_patronymic,
            }
        })

        let discipline = await Discipline.findOne({
            logging: false,
            where: {
                name: req.body.discipline_name
            }
        })

        if (!teacher) {
            await Teacher.create({
                surname: req.body.teacher_surname,
                name: req.body.teacher_name,
                patronymic: req.body.teacher_patronymic,
            })

            teacher = await Teacher.findOne({
                logging: false,
                where: {
                    surname: req.body.teacher_surname,
                    name: req.body.teacher_name,
                    patronymic: req.body.teacher_patronymic,
                }
            })
        }

        if (!discipline) {
            await Discipline.create({
                name: req.body.discipline_name,
                comment: '',
            })

            discipline = await Discipline.findOne({
                where: {
                    name: req.body.discipline_name,
                }
            })
        }

        userRequest.discipline_id = discipline.dataValues.id
        userRequest.discipline_name = discipline.dataValues.name
        userRequest.teacher_id = teacher.dataValues.id
        userRequest.teacher_name = teacher.dataValues.name
        userRequest.teacher_surname = teacher.dataValues.surname
        userRequest.teacher_patronymic = teacher.dataValues.patronymic

        await StudentCrudLoad.create(userRequest)

        res.status(201).json({
            message: "Учебная дисциплина успешно создана.",
            statusCode: res.statusCode
        })

    } catch (err) {
        res.status(400).json({
            message: 'Не удалось найти данные.',
            statusCode: res.statusCode,
        })
    }
}

exports.deleteDiscipline = async (req, res, next) => {
    try {
        await StudentCrudLoad.destroy({
            where: {
                teacher_id: req.body.teacher_id,
                discipline_id: req.body.discipline_id,
                group_id: req.body.group_id,
            }
        })

        const whereCond = {
            discipline_id: req.body.discipline_id,
            group_id: req.body.group_id,
            student_id: req.body.student_id,
        }

        // req.body.lectures === 0 ? whereCond.practical = req.body.practical : whereCond.lectures = req.body.lectures

        console.log(whereCond)
        await Quiz.destroy({
            where: whereCond
        })

        res.status(200).json({
            message: 'Успешно удалено.',
            statusCode: res.statusCode,
        })
    } catch (err) {
        res.status(400).json({
            message: 'Не получается удалить данные.',
            statusCode: res.statusCode,
        })

        return
    }
}

exports.fetchEnglish = async (req, res, next) => {
    try {
        const english = await English.findAll({
            attributes: ['id', 'surname', 'name', 'patronymic']
        })

        const result = []
        for (const element of english) {
            result.push({
                id: element.id,
                seminarian: element.surname + ' ' + element.name + ' ' + element.patronymic,
            })
        }

        res.json(result)
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: "Что-то пошло не так."
        })
    }
}

exports.defineIndividual = async (req, res) => {
    const student_id = req.user.id

    const student_group = await Student.findOne({
        attributes: ['groups'],
        where: {
            id: student_id
        }
    })

    const yearAdmitted = student_group.groups.split('-', 3)[2]
    const semester = (process.env.CURRENT_YEAR % 2000 - Number(yearAdmitted) + 1) * process.env.WORKING_SEMESTER

    let dataQuery = ''
    if (req.query.individual_type === 'chain') {
        dataQuery = `SELECT i.id, d.name, i.lecturer, i.seminarian, d.id as discipline_id FROM individual i JOIN discipline d ON d.id = i.discipline JOIN teacher t1 ON i.lecturer = t1.id JOIN teacher t2 ON i.seminarian = t2.id where i.semester = ${semester} and i.type != "e";`
    } else if (req.query.individual_type === 'elective') {
        dataQuery = `SELECT i.id, d.name, i.lecturer, i.seminarian, d.id as discipline_id FROM individual i JOIN discipline d ON d.id = i.discipline JOIN teacher t1 ON i.lecturer = t1.id JOIN teacher t2 ON i.seminarian = t2.id where i.semester = ${semester} and i.type = "e";`
    } else {
        res.status(400).json({
            message: "Убедитесь в корректности введеных данных.",
            statusCode: res.statusCode,
        })

        return
    }

    const data = await Individual.sequelize.query(dataQuery, {type: QueryTypes.SELECT})

    const listOfChains = []
    for (const element of data) {
        let teacher = await Teacher.findOne({
            attributes: ['id', 'surname', 'name', 'patronymic'],
            where: {
                id: element.lecturer
            }
        })

        const lecturer = teacher.surname + ' ' + teacher.name + ' ' + teacher.patronymic
        const lecturer_id = teacher.id

        teacher = await Teacher.findOne({
            attributes: ['id', 'surname', 'name', 'patronymic'],
            where: {
                id: element.seminarian
            }
        })

        const seminarian = teacher.surname + ' ' + teacher.name + ' ' + teacher.patronymic
        const seminarian_id = teacher.id

        listOfChains.push({
            lecturer: lecturer,
            seminarian: seminarian,
            lecturer_id: lecturer_id,
            seminarian_id: seminarian_id,
            discipline_name: element.name,
            discipline_id: element.discipline_id
        })
    }

    res.json(listOfChains)
}
