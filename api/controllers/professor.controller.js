const Professor = require('../models/professor')
const {QueryTypes, Op} = require("sequelize");
const Quiz = require("../models/quiz");
const Teacher = require("../models/teacher");
const {sum} = require("../service/student.service");
const service = require('../service/professor.service')


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

        // const quizzes = await Quiz.findAll({
        //     where: {
        //         [Op.or]: [
        //             {seminarian_id: id},
        //             {lecturer_id: id},
        //         ]
        //     }
        // })
        const query = `SELECT DISTINCT quizzes.id, quizzes.discipline_id, student_crud_load.discipline_name, student_crud_load.teacher_surname, student_crud_load.teacher_name, student_crud_load.teacher_patronymic FROM \`quizzes\` join student_crud_load on student_crud_load.discipline_id = quizzes.discipline_id where (quizzes.lecturer_id = ${id} or quizzes.seminarian_id = ${id}) and student_crud_load.teacher_id = ${id}`
        const quizzes = await Quiz.sequelize.query(query, {queryType: QueryTypes.SELECT})

        const length = quizzes[0].length

        if (length !== 0) {
            let groups = new Set()
            let disciplines = new Map()

            for (let i = 0; i < length; i++) {
                disciplines.set(quizzes[0][i].discipline_id, quizzes[0][i].discipline_name)
            }

            // for future feature
            groups = Array.from(groups)
            disciplines = Array.from(disciplines.entries())
            let totalScore = 0
            let totalCount = 0

            const ratingByDisciplines = []

            if (disciplines.length === 0) {
                res.status(200).json({
                    teacherRatingByDiscipline: [],
                    totalScore: 0
                })

                return
            }

            for (let i = 0; i < disciplines.length; i++) {
                const disciplineRating = await service.getScoreByDiscipline(id, disciplines[i])

                if (disciplineRating.lecturer_score == "NaN" || disciplineRating.lecturer_score === 0) {
                    totalCount -= 1
                }
                if (disciplineRating.seminarian_score == "NaN" || disciplineRating.seminarian_score === 0) {
                    totalCount -= 1
                }

                ratingByDisciplines.push({
                    discipline_id: disciplines[i][0],
                    discipline_name: disciplines[i][1],
                    ...disciplineRating
                })

                totalCount += 2
                totalScore += Number(disciplineRating.lecturer_score) + Number(disciplineRating.seminarian_score)
            }

            res.status(200).json({
                teacherRatingByDiscipline: ratingByDisciplines,
                totalScore: (totalScore / totalCount).toFixed(2)
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
