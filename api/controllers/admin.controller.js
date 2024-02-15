const Quiz = require('../models/quiz')
const {QueryTypes, Op} = require("sequelize");
const Teacher = require("../models/teacher");

exports.getAllProfessorsAverageScore = async (req, res) => {
    const teachers = await Teacher.findAll({
        logging: false,
        attributes: ['id', 'name', 'surname', 'patronymic'],
        where: {
            id: {
                [Op.ne]: 180
            }
        }
    })

    const teacherIds = []
    for (const teacher of teachers) {
        // teacherIds.add(teacher.dataValues.id)

        const quizzes = await Quiz.findAll({
            logging: false,
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

exports.getCommentsByProfessorsId = async (req, res) => {
    const professorsId = req.body.professors_id

    if (!professorsId) {
        res.status(400).json({
            message: "Не выбран преподаватель или нет данных.",
            statusCode: res.statusCode,
        })

        return
    }

    try {
        const commentsQuery = `
            SELECT 'lecturer' AS type, 'pros' AS side, lecturer_pros AS comment
            FROM ${process.env.CURRENT_YEAR_QUIZZES}
            WHERE lecturer_id = ${professorsId} AND lecturer_pros IS NOT NULL AND lecturer_pros <> ''
            UNION
            SELECT 'lecturer' AS type, 'cons' AS side, lecturer_cons AS comment
            FROM ${process.env.CURRENT_YEAR_QUIZZES}
            WHERE lecturer_id = ${professorsId} AND lecturer_cons IS NOT NULL AND lecturer_cons <> ''
            UNION
            SELECT 'seminarian' AS type, 'pros' AS side, seminarian_pros AS comment
            FROM ${process.env.CURRENT_YEAR_QUIZZES}
            WHERE seminarian_id = ${professorsId} AND seminarian_pros IS NOT NULL AND seminarian_pros <> ''
            UNION
            SELECT 'seminarian' AS type, 'cons' AS side, seminarian_cons AS comment
            FROM ${process.env.CURRENT_YEAR_QUIZZES}
            WHERE seminarian_id = ${professorsId} AND seminarian_cons IS NOT NULL AND seminarian_cons <> '';
        `
        const comments = await Quiz.sequelize.query(commentsQuery, {type: QueryTypes.SELECT, logging: false})

        res.status(200).json(comments)
    } catch (err) {
        res.status(500).json({
            message: 'Что-то пошло не так.',
            error: err.stack,
            statusCode: res.statusCode
        })
    }
}