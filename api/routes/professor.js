const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const controller = require('../controllers/professor.controller')
const Quiz = require("../models/quiz");
const checkRole = require('../middleware/roleMiddleware')
const mailService = require('../service/recovery.service')


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
    if (req.user.role === 'Administrator') {
        res.status(204).redirect(`${process.env.HOST_NAME}/admin`)
        return
    }
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

router.post('/changePassword', async (req, res, next) => {
    await mailService.changePassword(req, res)
})

module.exports = router;