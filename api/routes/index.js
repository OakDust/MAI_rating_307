const express = require('express');
const router = express.Router();

const controller = require('../controllers/index.controller')
const {body, validationResult} = require('express-validator')
const Student = require("../models/student");
const Professor = require("../models/professor");
const recoveryService = require('../service/mail.service')


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

            // req.body.role === 'Студент' ?
            //     await controller.createStudent(req, res)
            //     :
            //     res.status(400).json({
            //         message: 'Неверный формат данных.',
            //         statusCode: res.statusCode,
            //     })

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

router.post('/professorRegister', async (req, res, next) => {
    // if (req.query.security_token === process.env.REGISTER_PROFESSOR_LINK_TOKEN) {
    //     console.log(req.query)
        await controller.createProfessor(req, res)
    // } else {
    //     res.status(403).json({
    //         message: 'Недостаточно прав для просмотра страницы',
    //         statusCode: res.statusCode
    //     })
    //
    //     return
    // }
})

router.get('/activate/:activationLink', async (req, res) => {
    let urlQuery = req.params.activationLink

    urlQuery = urlQuery.split('&role=')

    const [activationLink, role] = [urlQuery[0], urlQuery[1]]

    if (role === 'Студент') {
        let user = await Student.findOne({
            where: {
                activation_link: activationLink
            }
        })

        if (!user) {
            res.status(400).json({
                message: "Такого студента не существует.",
                statusCode: res.statusCode,
            })

            return
        }

        user.set({ active: true })

        await user.save()

    } else if (role === 'Преподаватель') {
        const user = await Professor.findOne({
            where: {
                activation_link: activationLink
            }
        })

        if (!user) {
            res.status(400).json({
                message: "Такого преподавателя не существует.",
                statusCode: res.statusCode,
            })

            return
        }

        user.set({ active: true })

        await user.save()
    }

    res.status(200).redirect(`${process.env.REACT_APP_API_URL}/auth`)
})

router.post('/recoveryMail', async (req, res, next) => {
    await recoveryService.recoverPassword(req, res)
})

router.get('/recoverPassword/:data', async (req, res, next) => {
    await controller.getEmailByParams(req, res)
})

router.post('/recoverPassword', async (req, res, next) => {
    await controller.setNewPasswordByRecovery(req, res)
})

module.exports = router;
