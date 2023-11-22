const cheerio = require("cheerio");
const Teacher = require("../models/teacher");
const GroupsDB = require("../models/groups");
const DistributedLoad = require("../models/distributed_load");
const {QueryTypes} = require("sequelize");
const Quiz = require("../models/quiz");
const Student = require("../models/student");


exports.clearArray = (array) => {
    const replacedArray = []

    array.map((element) => {
        const temp = element.toString()
        replacedArray.push(temp.replace('.', ''))
    })

    return replacedArray
}

exports.getSurveysStudentPassed = async (student) => {
    let surveys_passed = []
    const surveys = await Quiz.findAll({
        where: {
            student_id: student.dataValues.id
        }
    })

    if (surveys.length === 0) {
        surveys_passed.push({
            student_id: student.dataValues.id,
            surveys_passed: 0,
        })
    } else {
        surveys_passed = this.fillSubmittedSurveys(surveys, student)
    }

    return surveys_passed
}

exports.fillSubmittedSurveys = async (surveys, student) => {
    const submitted_surveys = []
    const arrayToFill = []
    for (let i = 0; i < surveys.length; i++) {
        const temp = {
            discipline_id: surveys[i].dataValues.discipline_id,
            quiz_id: surveys[i].dataValues.id
        }
        submitted_surveys.push(temp)
    }

    arrayToFill.push({
        student_id: student.dataValues.id,
        submitted_surveys: submitted_surveys
    })

    return arrayToFill
}

exports.prettyArray = (array, obj) => {
    const pretty = [{}]

    for (let i = 0; i < array.length; i++) {
        if (!obj[i]) continue

        let discipline = array[i][0]
        let groups = array[i][1]

        let lecturer = obj[i].lecturer
        let seminarian = obj[i].seminarian

        if (array[i][0] !== 'Итого:' && array[i].length !== 0) {
            let string = groups.toString().substring(0, 4) + groups.toString().substring(5, groups.toString().length)

            pretty.push({
                lecturer: lecturer,
                seminarian: seminarian,
                discipline: discipline,
                groups: string,
            })
        }

        pretty.filter(value => Object.keys(value).length !== 0)
    }

    return pretty.splice(2, pretty.length)
}

exports.parseTable = (html) => {
    // Загрузка HTML с помощью cheerio
    const $ = cheerio.load(html);

// Массив для хранения извлеченных данных
    const extractedData = [];
    const links = []
// Перебор строк таблицы
    $('table tr').each((rowIndex, row) => {
        const rowData = [];

        // Перебор ячеек строки
        const current = $(row).find('td').last().text()

        if (current !== 'Не распределено.') {
            $(row).find('td').each((cellIndex, cell) => {
                const cellText = $(cell).text().trim(); // Извлечение текста из ячейки

                const a = $(cell).find('a').first().attr('href')
                if (a !== undefined) {
                    links.push(a)
                }

                if (cellText !== '' && cellText !== undefined && cellText !== 'Не распределено.') {
                    rowData.push(cellText); // Сохранение текста в массив данных строки
                }
            });
        }

        extractedData.push(rowData); // Сохранение данных строки в массив извлеченных данных
    });

    const linkArray = links.filter(val => val)

    const outArray = this.clearArray(linkArray)

    return [outArray, extractedData]
}

exports.teacherExists = async (body) => {
    const [lecturerSurname, lecturerName, lecturerPatronymic] = body[0].lecturer_name.split(' ')
    const [seminarianSurname, seminarianName, seminarianPatronymic] = body[0].seminarian_name.split(' ')

    const lecturer = await Teacher.findOne({
        where: {
            name: lecturerName,
            surname: lecturerSurname,
            patronymic: lecturerPatronymic,
        }
    })

    const seminarian = await Teacher.findOne({
        where: {
            name: seminarianName,
            surname: seminarianSurname,
            patronymic: seminarianPatronymic,
        }
    })

    return [lecturer, seminarian]
}

exports.comprehensiveArray = async (req, res, link) => {
    const response = await this.fetchProfessorLoad(req, res, link)

    const [links, parsed] = this.parseTable(response)

    const pretty = parsed.filter(val => val !== '' && val.length !== 0)

    const comprehensive = pretty.splice(1, pretty.length - 2)

    return comprehensive
}

exports.getObject = async (req, res, link) => {
    const comprehensive = await this.comprehensiveArray(req, res, link)

    let lecturer = ''
    let seminarian = ''

    for (let i = 0; i < comprehensive.length; i++) {
        if (comprehensive[i][0] === 'Итого:') {continue}

        switch (comprehensive.length) {
            case 2:
                lecturer = comprehensive[0][0]
                seminarian = comprehensive[0][0]
            case 1:
                lecturer = comprehensive[0][0]
                seminarian = comprehensive[0][0]
            default:
                if (comprehensive[i][1] !== '-' || comprehensive[i][5] !== '-') {lecturer = comprehensive[i][0]}

                if (comprehensive[i][2] !== '-') {seminarian = comprehensive[i][0]}
        }
    }

    const obj = {
        lecturer: lecturer,
        seminarian: seminarian
    }

    return obj
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
    return obj.surname + ' ' + obj.name + ' ' + obj.patronymic
}

exports.getGroupId = async (groupName) => {

    const groups = await GroupsDB.findOne({
        where: {
            name: groupName
        }
    })

    return groups.id
}

exports.applyDistributedLoad = async (semester, groups_id) => {
    const disciplinesQuery = `SELECT discipline.id, discipline.name from \`workload\` join discipline on discipline.id = workload.id_discipline where workload.id_group = ${groups_id} and workload.semester = ${semester}`
    const disciplinesResponse = await DistributedLoad.sequelize.query(disciplinesQuery, {type: QueryTypes.SELECT})

    const teachersQuery = `SELECT discipline.name as 'discipline', teacher.name, teacher.surname, teacher.patronymic, distributed_load.lectures, distributed_load.practical, distributed_load.laboratory from \`groups\` join workload on workload.id_group = groups.id join discipline on discipline.id = workload.id_discipline join distributed_load on distributed_load.id_load_group = workload.id and distributed_load.lectures = workload.lectures join teacher on teacher.id = distributed_load.id_teacher where groups.id = ${groups_id} and workload.semester = ${semester}`

    let check = []
    for (let i = 0; i < disciplinesResponse.length; i++) {
        let lecturer = ''
        let seminarian = ''
        let laborant = ''

        const teachers = await DistributedLoad.sequelize.query(teachersQuery + ` and discipline.id = ${disciplinesResponse[i].id}`, {type: QueryTypes.SELECT})

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