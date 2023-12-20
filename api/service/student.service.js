const Teacher = require("../models/teacher");
const GroupsDB = require("../models/groups");
const DistributedLoad = require("../models/distributed_load");
const {QueryTypes, Op} = require("sequelize");
const Quiz = require("../models/quiz");
const StudentCrudLoad = require("../models/student_crud_load");


exports.getSurveysStudentPassed = async (student_id) => {
    try {
        let surveys_passed = []
        let dbName = process.env.STUDENTS_BY_GROUPS_DB_NAME

        const surveysQuery = `SELECT ${dbName}.discipline.name as discipline_name, ${dbName}.discipline.id as discipline_id, ${dbName}.quizzes.id as quiz_id, ${dbName}.quizzes.student_id FROM ${dbName}.\`${process.env.CURRENT_YEAR_QUIZZES}\` join ${dbName}.discipline on ${dbName}.discipline.id = ${dbName}.${process.env.CURRENT_YEAR_QUIZZES}.discipline_id where ${dbName}.${process.env.CURRENT_YEAR_QUIZZES}.student_id = ${student_id}`

        const surveys = await Quiz.sequelize.query(surveysQuery, {
            type: QueryTypes.SELECT,
            logging: false
        })

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
            quiz_id: surveys[i].quiz_id
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

exports.getGroupId = async (groupName) => {
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

exports.getCrudDistributedLoad = async (distributed_load) => {
    let discipline_ids = new Set()
    let discipline_names = new Set()
    for (let i = 0; i < distributed_load.length; i++) {
        discipline_ids.add(distributed_load[i].dataValues.discipline_id)
        discipline_names.add(distributed_load[i].dataValues.discipline_name)
    }

    discipline_ids = Array.from(discipline_ids)
    discipline_names = Array.from(discipline_names)
    const check = []

    for (let i = 0; i < discipline_ids.length; i++) {
        let count = 0
        let data = []

        for (let j = 0; j < distributed_load.length; j++) {
            if (distributed_load[j].dataValues.discipline_id === discipline_ids[i]) {
                count++
                data.push(distributed_load[j].dataValues)
            }
        }

        let lecturer = ''
        let seminarian = ''
        let laborant = ''
        let lecturer_id = 0
        let seminarian_id = 0

        if (count === 1) {
            if (this.sum(data[0]) === 0 || (data[0].practical !== 0 && data[0].lectures !== 0)) {
                lecturer = this.getName(data[0])
                lecturer_id = data[0].teacher_id
                seminarian = lecturer
                seminarian_id = data[0].teacher_id
            }
            if (data[0].lectures !== 0 && data[0].practical === 0) {
                lecturer = this.getName(data[0])
                lecturer_id = data[0].teacher_id
            }
            if (data[0].practical !== 0 && data[0].lectures === 0) {
                seminarian = this.getName(data[0])
                seminarian_id = data[0].teacher_id
            }

            check.push({
                lecturer: lecturer,
                seminarian: seminarian,
                // laborant: laborant,
                discipline_id: discipline_ids[i],
                discipline: discipline_names[i],
                lecturer_id: lecturer_id,
                seminarian_id: seminarian_id,
                key: i,
            })

            continue

        } else if (count === 2) {
            for (let j = 0; j < count; j++) {

                if ((this.sum(data[j]) === 0 || data[j].lectures !== 0) && lecturer === '') {
                    lecturer = this.getName(data[j])
                }

                if (data[j].practical !== 0 && seminarian === '') {
                    seminarian = this.getName(data[j])
                }
                // data[j].practical !== 0 && seminarian === '' ?  : null
            }
        } else if (count === 3) {
            for (let j = 0; j < count; j++) {
                // this.sum(data[j]) === 0 || data[j].lectures !== 0 ? lecturer = this.getName(data[j]) : null
                //
                // data[j].practical !== 0 ? seminarian = this.getName(data[j]) : null
                if ((this.sum(data[j]) === 0 || data[j].lectures !== 0) && lecturer === '') {
                    lecturer = this.getName(data[j])
                }

                if (data[j].practical !== 0 && seminarian === '') {
                    seminarian = this.getName(data[j])
                }

                data[j].laboratory !== 0 ? laborant = this.getName(data[j]) : null
            }
        }

        const teacherId = await Teacher.findAll({
            where: {
                [Op.or]: [
                    {
                        name: lecturer.split(' ')[1],
                        surname: lecturer.split(' ')[0],
                        patronymic: lecturer.split(' ')[2],
                    },
                    {
                        name: seminarian.split(' ')[1],
                        surname: seminarian.split(' ')[0],
                        patronymic: seminarian.split(' ')[2],
                    }
                ]
            }
        })

        if (this.getName(teacherId[0]) === lecturer && count !== 1) {
            lecturer_id = teacherId[0].dataValues.id
            seminarian_id = teacherId[1].dataValues.id
        } else if (count !== 1) {
            lecturer_id = teacherId[1].dataValues.id
            seminarian_id = teacherId[0].dataValues.id
        }

        check.push({
            lecturer: lecturer,
            seminarian: seminarian,
            // laborant: laborant,
            discipline_id: discipline_ids[i],
            discipline: discipline_names[i],
            lecturer_id: lecturer_id,
            seminarian_id: seminarian_id,
            key: i,
        })
    }

    return check
}

exports.updateTeacherCheckBody = async (body) => {
    let dbWhere = {
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
        dbWhere.practical = getAmountOfTeachers[0].dataValues.practical
    } else if (amountOfTeachers === 2) {
        for (let i = 0; i < 2; i++) {
            if (body.lectures !== 0) {
                if (getAmountOfTeachers[i].dataValues.lectures !== 0 || this.sum(getAmountOfTeachers[i].dataValues) === 0) {
                    dbWhere.practical = getAmountOfTeachers[i].dataValues.practical
                    dbWhere.lectures = getAmountOfTeachers[i].dataValues.lectures
                }
            } else if (body.practical !== 0) {
                if (getAmountOfTeachers[i].dataValues.practical !== 0) {
                    dbWhere.lectures = getAmountOfTeachers[i].dataValues.lectures
                    dbWhere.practical = getAmountOfTeachers[i].dataValues.practical
                }
            }
        }

    } else if (amountOfTeachers === 3) {
        for (let i = 0; i < 3; i++) {
            if (body.lectures !== 0) {
                if (getAmountOfTeachers[i].dataValues.lectures !== 0 || this.sum(getAmountOfTeachers[i].dataValues) === 0) {
                    dbWhere.practical = getAmountOfTeachers[i].dataValues.practical
                    dbWhere.lectures = getAmountOfTeachers[i].dataValues.lectures
                }
            } else if (body.practical !== 0) {
                if (getAmountOfTeachers[i].dataValues.practical !== 0) {
                    dbWhere.lectures = getAmountOfTeachers[i].dataValues.lectures
                    dbWhere.practical = getAmountOfTeachers[i].dataValues.practical
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
