const Quiz = require('../models/quiz')
const {Sequelize, Op} = require("sequelize");
const Teacher = require("../models/teacher");

exports.getAllProfessorsAverageScore = async (req, res) => {
    // const quizzes = await Quiz.findAll({
    //     attributes: [
    //         [Sequelize.fn('DISTINCT', Sequelize.col('lecturer_id')), 'lecturer_id'],
    //         'seminarian_id'
    //     ]
    // })
    //
    // let teacher_ids = new Set()
    // quizzes.map((quiz) => {
    //     if (quiz.dataValues.lecturer_id === quiz.dataValues.seminarian_id) {
    //         teacher_ids.add(quiz.dataValues.lecturer_id)
    //     } else {
    //         teacher_ids.add(quiz.dataValues.lecturer_id)
    //         teacher_ids.add(quiz.dataValues.seminarian_id)
    //     }
    // })
    //
    // teacher_ids = Array.from(teacher_ids)

    const teachers = await Teacher.findAll({
        attributes: ['id', 'name', 'surname', 'patronymic']
    })

    const teacherIds = []
    for (const teacher of teachers) {
        // teacherIds.add(teacher.dataValues.id)

        const quizzes = await Quiz.findAll({
            where: {
                [Op.or]: [
                    {lecturer_id: teacher.dataValues.id},
                    {seminarian_id: teacher.dataValues.id}
                ]
            }
        })

        let score = 0
        let count = 0
        quizzes.forEach((quiz) => {
            if (quiz.dataValues.lecturer_id === quiz.dataValues.seminarian_id) {
                count += 2
                score += (quiz.dataValues.lecturer_score + quiz.dataValues.seminarian_score) / 7
            } else if (quiz.dataValues.lecturer_id === teacher.dataValues.id) {
                count += 1
                score += quiz.dataValues.lecturer_score / 7
            } else if (quiz.dataValues.seminarian_id === teacher.dataValues.id) {
                count += 1
                score += quiz.dataValues.seminarian_score / 7
            }

        })

        let resultScore = (score / count).toFixed(2)

        if (resultScore == 'NaN') {
            resultScore = 'Нет оценок'
        }
        teacherIds.push({
            id: teacher.dataValues.id,
            name: teacher.dataValues.surname + ' ' + teacher.dataValues.name + ' ' + teacher.dataValues.patronymic,
            score: resultScore
        })
    }

    // teacherIds = Array.from(teacherIds)

    res.status(200).json({
        message: 'Успешно.',
        // quizzes: quizzes,
        total_score: teacherIds,
        statusCode: res.statusCode,

    })
}