const Quiz = require("../models/quiz");
const {Op} = require("sequelize");


exports.getScoreByDiscipline = async (teacherID, disciplineID) => {
    const quizzes = await Quiz.findAll({
        where: {
            [Op.or]: [
                {seminarian_id: teacherID},
                {lecturer_id: teacherID},
            ],
            discipline_id: disciplineID,
        }
    })

    const quizzesByDiscipline = quizzes.map(value => value.dataValues)
    const quizzesAmount = quizzesByDiscipline.length

    let totalScore = 0
    let totalCount = 0

    let seminarianScore = 0
    let seminarianCount = 0
    let lecturerScore = 0
    let lecturerCount = 0

    for (let i = 0; i < quizzesAmount; i++) {
        let [lecturer_id, seminarian_id] = [quizzes[i].dataValues.lecturer_id, quizzes[i].dataValues.seminarian_id]

        if (seminarian_id === teacherID) {
            seminarianCount += 1
            seminarianScore += quizzes[i].dataValues.seminarian_score / 7

            if (quizzes[i].dataValues.seminarian_score !== 0) {
                totalScore += quizzes[i].dataValues.seminarian_score / 7
                totalCount += 1
            }
        }

        if (lecturer_id === teacherID) {
            lecturerCount += 1
            lecturerScore += quizzes[i].dataValues.lecturer_score / 7

            if (quizzes[i].dataValues.lecturer_score !== 0) {
                totalScore += quizzes[i].dataValues.lecturer_score / 7
                totalCount += 1
            }
        }
    }

    lecturerScore = (lecturerScore / lecturerCount).toFixed(2)
    seminarianScore = (seminarianScore / seminarianCount).toFixed(2)
    if (lecturerScore == "NaN") {
        lecturerScore = 0
    }
    if (seminarianScore == "NaN") {
        seminarianScore = 0
    }

    const ratingDTO = {
        lecturer_score: lecturerScore,
        seminarian_score: seminarianScore,
    }

    return ratingDTO
}