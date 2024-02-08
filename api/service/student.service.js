const Teacher = require("../models/teacher");
const GroupsDB = require("../models/groups");
const DistributedLoad = require("../models/distributed_load");
const {QueryTypes, Op} = require("sequelize");
const Quiz = require("../models/quiz");
const StudentCrudLoad = require("../models/student_crud_load");
const Student = require("../models/student");


exports.getSurveysStudentPassed = async (student_id) => {
    try {
        let surveys_passed = []
        let dbName = process.env.DB_NAME
        // let current = process.env.CURRENT_DB_CONFIG
        let quizzes = process.env.CURRENT_YEAR_QUIZZES
        let current = process.env.DB_NAME


        const surveysQuery = `SELECT ${current}.discipline.name as discipline_name, ${current}.discipline.id as discipline_id, ${dbName}.${quizzes}.id as quiz_id, ${dbName}.${quizzes}.student_id, ${dbName}.${quizzes}.info as info FROM ${dbName}.\`${quizzes}\` join ${current}.discipline on ${current}.discipline.id = ${dbName}.${quizzes}.discipline_id where ${dbName}.${quizzes}.student_id = ${student_id}`

        const surveys = await Quiz.sequelize.query(surveysQuery, {
            type: QueryTypes.SELECT,
            logging: false
        })

        // console.log(surveys)

        if (surveys.length === 0) {
            surveys_passed.push({
                student_id: student_id,
                surveys_passed: 0,
            })
        } else {
            surveys_passed = this.fillSubmittedSurveys(student_id, surveys)
        }

        return surveys_passed
    } catch (err) {
        return []
    }

}

exports.fillSubmittedSurveys = (student_id, surveys) => {
    const submitted_surveys = []

    for (let i = 0; i < surveys.length; i++) {
        const temp = {
            discipline_id: surveys[i].discipline_id,
            discipline_name: surveys[i].discipline_name,
            quiz_id: surveys[i].quiz_id,
            info: surveys[i].info
        }
        submitted_surveys.push(temp)
    }

    const objectToFill = {
        student_id: student_id,
        submitted_surveys: submitted_surveys
    }

    return objectToFill
}

exports.teacherExists = async (body) => {
    if (body[0].lecturer_name === '' || body[0].seminarian_name === '') {
        let lecturer
        let seminarian

        if (body[0].lecturer_name === '' && body[0].seminarian_name !== '') {
            const [seminarianSurname, seminarianName, seminarianPatronymic] = body[0].seminarian_name.split(' ')

            seminarian = await Teacher.findOne({
                logging: false,
                where: {
                    name: seminarianName,
                    surname: seminarianSurname,
                    patronymic: seminarianPatronymic,
                }
            })

            lecturer = {
                    name: '',
                    surname: '',
                    patronymic: '',
                    id: -1
            }
        } else if (body[0].lecturer_name !== '' && body[0].seminarian_name === '') {
            const [lecturerSurname, lecturerName, lecturerPatronymic] = body[0].lecturer_name.split(' ')

            lecturer = await Teacher.findOne({
                logging: false,
                where: {
                    name: lecturerName,
                    surname: lecturerSurname,
                    patronymic: lecturerPatronymic,
                }
            })

            seminarian = {
                    name: '',
                    surname: '',
                    patronymic: '',
                    id: -1
            }
        }

        return [lecturer, seminarian]
    }


    const [lecturerSurname, lecturerName, lecturerPatronymic] = body[0].lecturer_name.split(' ')
    const [seminarianSurname, seminarianName, seminarianPatronymic] = body[0].seminarian_name.split(' ')

    const lecturer = await Teacher.findOne({
        logging: false,
        where: {
            name: lecturerName,
            surname: lecturerSurname,
            patronymic: lecturerPatronymic,
        }
    })

    const seminarian = await Teacher.findOne({
        logging: false,
        where: {
            name: seminarianName,
            surname: seminarianSurname,
            patronymic: seminarianPatronymic,
        }
    })

    return [lecturer, seminarian]
}

exports.fetchProfessorLoad = async (req, res, link) => {
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


    const url = new URL(link, 'http://n20230.xmb.ru')

    let response
    await fetch(url, requestHeaders)
        .then((res) => res.text())
        .then((text) => {
            response = text
        })

    return response
}

exports.sortDataByGroup = (groups, array) => {
    let result = [{}]

    for (let i = 0; i < array.length; i++) {

        if (groups === array[i].groups && array.length !== 0) {
            result.push({
                key: i,
                lecturer: array[i].lecturer,
                seminarian: array[i].seminarian,
                discipline: array[i].discipline,
                groups: array[i].groups
            })
        }
    }

    return result.filter(value => Object.keys(value).length !== 0)

}

exports.sum = (obj) => {
    return obj.lectures + obj.practical + obj.laboratory
}

exports.getName = (obj) => {
    if (obj.surname && obj.name && obj.patronymic) {
        return obj.surname + ' ' + obj.name + ' ' + obj.patronymic
    } else if (obj.teacher_surname && obj.teacher_name && obj.teacher_patronymic) {
        return obj.teacher_surname + ' ' + obj.teacher_name + ' ' + obj.teacher_patronymic
    } else {
        throw new Error('Object type is undefined')
        return
    }
}

exports.getGroupName = (groupNameParticials) => {
    return groupNameParticials[0] + '-' + String(process.env.CURRENT_YEAR % 2000 - Number(groupNameParticials[2]) + 1) + groupNameParticials[1] + '-' + groupNameParticials[2]
}

exports.getGroupId = async (groupName) => {
    console.log(groupName)
    const groups = await StudentCrudLoad.findOne({
        logging: false,
        where: {
            group_name: groupName
        }
    })

    return groups.dataValues.group_id
}

exports.applyDistributedLoad = async (semester, groups_id, db_name) => {
    const disciplinesQuery = `SELECT ${db_name}.discipline.id, ${db_name}.discipline.name from ${db_name}.\`workload\` join ${db_name}.discipline on ${db_name}.discipline.id = ${db_name}.workload.id_discipline where ${db_name}.workload.id_group = ${groups_id} and ${db_name}.workload.semester = ${semester}`
    const disciplinesResponse = await DistributedLoad.sequelize.query(disciplinesQuery, {
        type: QueryTypes.SELECT,
        logging: false
    })

    const teachersQuery = `SELECT ${db_name}.discipline.name as 'discipline', ${db_name}.teacher.name, ${db_name}.teacher.surname, ${db_name}.teacher.patronymic, ${db_name}.distributed_load.lectures, ${db_name}.distributed_load.practical, ${db_name}.distributed_load.laboratory from ${db_name}.\`groups\` join ${db_name}.workload on ${db_name}.workload.id_group = ${db_name}.groups.id join ${db_name}.discipline on ${db_name}.discipline.id = ${db_name}.workload.id_discipline join ${db_name}.distributed_load on ${db_name}.distributed_load.id_load_group = ${db_name}.workload.id and ${db_name}.distributed_load.lectures = ${db_name}.workload.lectures join ${db_name}.teacher on ${db_name}.teacher.id = ${db_name}.distributed_load.id_teacher where ${db_name}.groups.id = ${groups_id} and ${db_name}.workload.semester = ${semester}`

    let check = []
    for (let i = 0; i < disciplinesResponse.length; i++) {
        let lecturer = ''
        let seminarian = ''
        let laborant = ''

        const teachers = await DistributedLoad.sequelize.query(teachersQuery + ` and discipline.id = ${disciplinesResponse[i].id}`, {
            type: QueryTypes.SELECT,
            logging: false
        })

        if (teachers.length === 1) {
            lecturer = this.getName(teachers[0])
            seminarian = lecturer
        } else if (teachers.length === 2) {
            for (let j = 0; j < 2; j++) {
                this.sum(teachers[j]) === 0 || teachers[j].lectures !== 0 ? lecturer = this.getName(teachers[j]) :  null

                teachers[j].practical !== 0 ? seminarian = this.getName(teachers[j]) : null
            }
        } else if (teachers.length === 3) {
            for (let j = 0; j < 3; j++) {
                this.sum(teachers[j]) === 0 || teachers[j].lectures !== 0 ? lecturer = this.getName(teachers[j]) :  null

                teachers[j].practical !== 0 ? seminarian = this.getName(teachers[j]) : null

                teachers[j].laboratory !== 0 ? laborant = this.getName(teachers[j]) : null
            }
        } else if (teachers.length === 0) {
            lecturer = 'Не распределено'
            seminarian = 'Не распределено'
        }

        check.push({
            lecturer: lecturer,
            seminarian: seminarian,
            discipline: disciplinesResponse[i].name,
            discipline_id: disciplinesResponse[i].id,
            key: i,
            // groups: groupName
        })
    }

    return check
}

exports.getCrudDistributedLoad = async (group_id, semester, distributed_load) => {
    let discipline_ids = new Set()

    for (const item of distributed_load) {
        discipline_ids.add(item.dataValues.discipline_id)
    }

    const data = new Map()
    for (const id of discipline_ids) {
        const load = await StudentCrudLoad.findAll({
            raw: true,
            where: {
                discipline_id: id,
                semester: semester,
                group_id: group_id
            }
        })
        data.set(id, load)
    }

    const load = []
    let key = 0
    for (const [disciplineId, entries] of data) {
        let lecturer = ''
        let seminarian = ''
        let lecturer_id = -1
        let seminarian_id = -1

        for (const node of entries) {
            if (lecturer === '' && (node.lectures > 0 && node.practical === 0 || (node.lectures + node.practical === 0))) {
                lecturer = this.getName(node)
                lecturer_id = node.teacher_id
            }

            if (seminarian === '' && (node.practical > 0 && node.lectures === 0)) {
                seminarian = this.getName(node)
                seminarian_id = node.teacher_id
            }
        }

        load.push({
            lecturer,
            seminarian,
            discipline_id: disciplineId,
            discipline: entries[0].discipline_name,
            lecturer_id,
            seminarian_id,
            key,
        })

        key++
    }

    return load
}

exports.appendChainsAndElectives = async (req) => {
    const student_id = req.user.id

    const student_group = await Student.findOne({
        attributes: ['groups'],
        where: {
            id: student_id
        }
    })

    const yearAdmitted = student_group.groups.split('-', 3)[2]
    const semester = (process.env.CURRENT_YEAR % 2000 - Number(yearAdmitted) + 1) * process.env.WORKING_SEMESTER

    return semester
}

exports.updateTeacherCheckBody = async (body) => {
    const dbWhere = {
        group_id: body.group_id,
        semester: body.semester,
        discipline_id: body.discipline_id,
        teacher_id: body.teacher_id,
    }

    const getAmountOfTeachers = await StudentCrudLoad.findAll({
        where: {
            group_id: body.group_id,
            semester: body.semester,
            discipline_id: body.discipline_id
        }
    })

    let amountOfTeachers = getAmountOfTeachers.length
    if (amountOfTeachers === 1) {
        const firstTeacher = getAmountOfTeachers[0].dataValues
        dbWhere.practical = firstTeacher.practical
        dbWhere.lectures = firstTeacher.lectures
    } else {
        for (let i = 0; i < amountOfTeachers; i++) {
            const currentTeacher = getAmountOfTeachers[i].dataValues
            if (body.lectures !== 0) {
                if (currentTeacher.lectures !== 0 || (currentTeacher.lectures + currentTeacher.practical) === 0) {
                    dbWhere.practical = currentTeacher.practical
                    dbWhere.lectures = currentTeacher.lectures
                    break
                }
            } else if (body.practical !== 0) {
                if (currentTeacher.practical !== 0) {
                    dbWhere.lectures = currentTeacher.lectures
                    dbWhere.practical = currentTeacher.practical
                    break
                }
            }
        }
    }

    const distributed_load = await StudentCrudLoad.findOne({
        where: dbWhere
    })

    const teacher = await Teacher.findOne({
        where: {
            name: body.teacher_name,
            surname: body.teacher_surname,
            patronymic: body.teacher_patronymic,
        }
    })

    return [distributed_load, teacher]
}

exports.getUserGroupById = async (req, res) => {
    let queryYear = ''
    if (req.query.groups) {
        queryYear = req.query.groups.split('-', 3)
    } else {
        queryYear = req.body.group_name.split('-', 3)
    }

    const date = new Date()

    let numberOfCourse = 0
    let semester = 0
    if (process.env.CURRENT_YEAR_CRUD_DB === 'load_22') {
        numberOfCourse = process.env.CURRENT_YEAR % 2000 - queryYear[2] + 1
        semester = 1
    } else if (process.env.CURRENT_YEAR_CRUD_DB === 'student_crud_load') {
        numberOfCourse = process.env.CURRENT_YEAR % 2000 - queryYear[2] + 1
        semester = date.getMonth() > 1 ? 0 : 1
    } else {
        res.status(500).json({
            message: 'DB initialization error. Check .env',
            statusCode: res.statusCode
        })

        return
    }
    // const numberOfCourse = date.getFullYear() - 2000 - queryYear[2] + 1
    // const numberOfCourse = 2023 - 2000 - queryYear[2] + 1
    // const semester = date.getMonth() > 1 ? 0 : 1

    const groupName = this.getGroupName(queryYear)
    return [groupName, semester]
}
