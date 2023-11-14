const express = require('express');
const router = express.Router();

const controller = require('../controllers/professor.controller')
const Quiz = require("../models/quiz");

router.get('/', async (req, res, next) => {
    // await controller.showProfessors(req, res)
});

router.get('/rating', async (req, res, next) => {
    const quizzes = await Quiz.findAll({
        where: {
            seminarian_id: 35
        }
    })

    res.status(200).json(quizzes)
})

module.exports = router;