const Professor = require('../models/professor')
const {QueryTypes, Op} = require("sequelize");
const Quiz = require("../models/quiz");
const Teacher = require("../models/teacher");
const {sum} = require("../service/student.service");


exports.showProfessors = async (req, res) => {
    const professors = await Professor.findAll()

    res.status(200).json(professors)
}

exports.getAllTeachersRating = async (req, res) => {
    const teachers = await Teacher.findAll()
    const rating = []
    let index = 0
    for (const teacher of teachers.entries()) {
        const query = `SELECT kaf307_2023.teacher.id, kaf307_2023.teacher.name, kaf307_2023.teacher.surname, kaf307_2023.teacher.patronymic, kaf307_opros.quizzes.lecturer_score, kaf307_opros.quizzes.seminarian_score, kaf307_opros.quizzes.lecturer_id, kaf307_opros.quizzes.seminarian_id
          FROM kaf307_2023.teacher INNER JOIN kaf307_opros.quizzes
          ON kaf307_2023.teacher.id = kaf307_opros.quizzes.lecturer_id or kaf307_2023.teacher.id = kaf307_opros.quizzes.seminarian_id where kaf307_2023.teacher.id = ${teacher[1].dataValues.id}`

        const quizzes = await Quiz.sequelize.query(query, {type: QueryTypes.SELECT})

        if (quizzes.length !== 0) {
            rating.push({
                teacher_id: teacher[1].dataValues.id,
                teacher_name: teacher[1].dataValues.surname + ' ' + teacher[1].dataValues.name + ' ' + teacher[1].dataValues.patronymic,
                quiz_data: []
            })

            let seminarian_score = 0
            let seminarian_subs = 0
            let lecturer_score = 0
            let lecturer_subs = 0
            for (const quiz of quizzes.entries()) {
                if (quiz[1].lecturer_id === teacher[1].dataValues.id) {
                    lecturer_score += quiz[1].lecturer_score / 7
                    lecturer_subs += 1
                }
                console.log(lecturer_score)

                if (quiz[1].seminarian_id === teacher[1].dataValues.id) {
                    seminarian_score += quiz[1].seminarian_score / 7
                    seminarian_subs += 1
                }
            }

            rating[index].quiz_data = {
                lecturer_score: Number(lecturer_score / lecturer_subs).toFixed(2),
                seminarian_score: Number(seminarian_score / seminarian_subs).toFixed(2)
            }

            index += 1
        }

    }

    res.status(200).json(rating)
}

exports.getTeacherRatingById = async (req, res) => {
    try {
        const id = req.user.id
        const teacher = await Teacher.findOne({
            attributes: ['id', 'name', 'surname', 'patronymic'],
            where: {
                id: id
            }
        })

        if (!teacher) {
            res.status(400).json({
                message: 'Нет такого преподавателя.',
                statusCode: res.statusCode,
            })

            return
        }

        const quizzes = await Quiz.findAll({
            where: {
                [Op.or]: [
                    {seminarian_id: id},
                    {lecturer_id: id},
                ]
            }
        })

        const length = quizzes.length

        if (length !== 0) {
            let groups = new Set()
            let disciplines = new Set()

            let seminarianScore = 0
            let seminarianCount = 0
            let lecturerScore = 0
            let lecturerCount = 0

            for (let i = 0; i < length; i++) {
                let [lecturer_id, seminarian_id] = [quizzes[i].dataValues.lecturer_id, quizzes[i].dataValues.seminarian_id]

                // for future feature
                groups.add(quizzes[i].dataValues.group_id)

                if (seminarian_id === id) {
                    seminarianCount += 1
                    seminarianScore += quizzes[i].dataValues.seminarian_score
                } else if (lecturer_id === id) {
                    lecturerCount += 1
                    lecturerScore += quizzes[i].dataValues.lecturer_score
                }

                disciplines.add({
                    discipline_id: quizzes[i].dataValues.discipline_id,
                    discipline_name: quizzes[i].dataValues.discipline_name,
                    lecturerScore: lecturerScore / lecturerCount / 7,
                    seminarianScore: seminarianScore / seminarianCount / 7
                })

            }

            groups = Array.from(groups)
            disciplines = Array.from(disciplines)

            res.status(200).json({
                teacher: teacher,
                quizzes: quizzes,
                groups: groups,
                lecturerScore: lecturerScore / lecturerCount / 7,
                seminarianScore: seminarianScore / seminarianCount / 7,
                test: disciplines
            })
        } else {
            res.status(200).json({
                teacher: teacher,
                quizzes: []
            })
        }
    } catch (err) {
        res.status(400).json({
            message: "Неверный формат данных.",
            statusCode: res.statusCode
        })

        return
    }

}
// SELECT kaf307_2023.teacher.id, kaf307_2023.teacher.name, kaf307_2023.teacher.surname, kaf307_2023.teacher.patronymic, kaf307_opros.quizzes.lecturer_score, kaf307_opros.quizzes.seminarian_score, kaf307_opros.quizzes.lecturer_id, kaf307_opros.quizzes.seminarian_id
// FROM kaf307_2023.teacher INNER JOIN kaf307_opros.quizzes
// ON kaf307_2023.teacher.id = kaf307_opros.quizzes.lecturer_id or kaf307_2023.teacher.id = kaf307_opros.quizzes.seminarian_id
