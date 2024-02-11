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
        const comments = {
            lecturer: {
                lecturer_pros: [],
                lecturer_cons: [],
            },
            seminarian: {
                seminarian_pros: [],
                seminarian_cons: [],
            }
        }

        const lecturerPros = await Quiz.findAll({
            attributes: ['lecturer_pros'],
            where: {
                lecturer_pros: {
                    [Op.ne]: ''
                },
                lecturer_id: professorsId,
            }
        })

        const lecturerCons = await Quiz.findAll({
            attributes: ['lecturer_cons'],
            where: {
                lecturer_cons: {
                    [Op.ne]: ''
                },
                lecturer_id: professorsId,
            }
        })

        const seminarianPros = await Quiz.findAll({
            attributes: ['seminarian_pros'],
            where: {
                seminarian_pros: {
                    [Op.ne]: ''
                },
                seminarian_id: professorsId,
            }
        })

        const seminarianCons = await Quiz.findAll({
            attributes: ['seminarian_cons'],
            where: {
                seminarian_cons: {
                    [Op.ne]: ''
                },
                seminarian_id: professorsId,
            }
        })

        comments.lecturer.lecturer_pros = lecturerPros
        comments.lecturer.lecturer_cons = lecturerCons
        comments.seminarian.seminarian_cons = seminarianCons
        comments.seminarian.seminarian_pros = seminarianPros

        // const lecturerComments = await Quiz.findAll({
        //     attributes: ['lecturer_pros', 'lecturer_cons'],
        //     where: {
        //         [Op.or]: [
        //             {
        //                 lecturer_pros: {
        //                     [Op.ne]: '',
        //                 },
        //             },
        //             {
        //                 lecturer_cons: {
        //                     [Op.ne]: ''
        //                 },
        //             }
        //         ],
        //         lecturer_id: professorsId
        //     }
        // })
        //
        // const seminarianComments = await Quiz.findAll({
        //     attributes: ['seminarian_pros', 'seminarian_cons'],
        //     where: {
        //         [Op.or] : [
        //             {
        //                 seminarian_pros: {
        //                     [Op.ne]: '',
        //                 },
        //             },
        //             {
        //                 seminarian_cons: {
        //                     [Op.ne]: ''
        //                 },
        //             }
        //         ],
        //         seminarian_id: professorsId
        //     }
        // })
        //
        // comments.lecturer_comments = lecturerComments
        // comments.seminarian_comments = seminarianComments

        res.status(200).json(comments)
    } catch (err) {
        res.status(500).json({
            message: 'Что-то пошло не так.',
            error: err.stack,
            statusCode: res.statusCode
        })
    }
}