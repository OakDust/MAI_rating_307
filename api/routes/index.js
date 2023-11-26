const express = require('express');
const router = express.Router();

const controller = require('../controllers/index.controller')
const {body, validationResult} = require('express-validator')

router.get('/register', async (req, res, next) => {
    try {
        await controller.getGroupsList(req, res)
    } catch (err) {
        res.status(500).json({
            message: 'Нет информации о списке групп.',
            statusCode: res.statusCode,
            error: err.message,
        })
    }
});

router.post('/register',
    [
        body('name').notEmpty().isString().isAlpha('ru-RU', {ignore: ' '}),
        body('surname').notEmpty().isString().isAlpha('ru-RU', {ignore: ' '}),
        body('patronymic').notEmpty().isString().isAlpha('ru-RU',{ignore: ' '}),
        body('email').notEmpty().isEmail(),
        body('password').notEmpty(), /// minlen
        body('role').notEmpty(),
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(400).json({
                    message: "Неверный формат данных.",
                    statusCode: res.statusCode,
                })
                return
            }

            req.body.role === 'Студент' ?
                await controller.createStudent(req, res)
                : req.body.role === 'Преподаватель' ?
                    await controller.createProfessor(req, res)
                    : res.status(400).json({
                        message: 'Неверный формат данных.',
                        statusCode: res.statusCode,
                    })
        } catch (err) {
            res.status(500).json({
                message: "Не получилось зарегистрироваться.",
                statusCode: res.statusCode,
                error: err.message,
            })
        }
})

module.exports = router;
