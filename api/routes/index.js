const express = require('express');
const router = express.Router();

const controller = require('../controllers/index.controller')
const {body, validationResults} = require('express-validator')

router.get('/registration', async (req, res, next) => {
    await controller.getGroupsList(req, res)
});

router.post('/',
    [
        body('name').notEmpty().isString().isAlpha('ru-RU', {ignore: ' '}),
        body('surname').notEmpty().isString().isAlpha('ru-RU', {ignore: ' '}),
        body('patronymic').notEmpty().isString().isAlpha('ru-RU',{ignore: ' '}),
        body('email').notEmpty().isEmail(),
        body('password').notEmpty().isString().isLength({min: 10}), /// minlen
        body('role').notEmpty(),
    ],
    (req, res, next) => {
    const errors = validationResults(req)
    if (errors) {
        res.status(400).json({message: "Неверный формат данных."})
    }

    req.body.role === 'Студент' ?
        controller.createStudent(req, res)
    : req.body.role === 'Преподаватель' ?
        controller.createProfessor(req, res)
    : res.status(400).json({message: 'Неверный формат данных.'})
})

module.exports = router;
