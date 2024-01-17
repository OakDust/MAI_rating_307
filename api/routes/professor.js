const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const controller = require('../controllers/professor.controller')
const Quiz = require("../models/quiz");
const checkRole = require('../middleware/roleMiddleware')

router.use(authMiddleware)
router.use(checkRole('Professor' || 'Administrator'))
router.get('/allRating', async (req, res, next) => {
    // await controller.showProfessors(req, res)
    // if (req.user.role === 'Преподаватель') {
    //     await controller.getRating(req, res)
    // } else {
    //     res.status(403).json({message: "Недостаточно прав."})
    // }
    await controller.getAllTeachersRating(req, res)

});

router.get('/myRating', async (req, res) => {
    await controller.getTeacherRatingById(req, res)
})

router.get('/', async (req, res, next) => {
    const quizzes = await Quiz.findAll({
        where: {
            seminarian_id: 35
        }
    })

    res.status(200).json(quizzes)
})

module.exports = router;