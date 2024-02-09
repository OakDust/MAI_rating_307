const Student = require('../models/student')
const Professor = require('../models/professor')
const bcrypt = require('bcryptjs')
const Teacher = require("../models/teacher");
const Groups = require("../models/groups");
const StudentsByGroups = require("../models/studentsByGroups");
const {Op} = require("sequelize");
const mailService = require('../service/mail.service')
const uuid = require('uuid')
const recoveryService = require("../service/recovery.service");


exports.getGroupsList = async (req, res) => {
    try {
        const groupsList = await Groups.findAll({
            where: {
                id: {
                    [Op.ne]: 1
                }
            }
        })

        const groups = []

        for (const group of groupsList) {
            const group_string = group.dataValues.name.split('-', 3)

            const group_name = group_string[0] + '-' + group_string[1].substring(1) + '-' + group_string[2]
            groups.push({
                group_id: group.dataValues.id,
                group_name: group_name
            })
        }

        res.status(200).json({
            groups: groups
        })
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: "Ошибка сервера."
        })
    }
}

exports.createStudent = async (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const groupName = req.body.groups

    if (!groupName) {
        res.status(400).json({message: 'Укажите группу'})
        return
    }

    const dbStudent = await StudentsByGroups.findOne({
        where: {
            name: req.body.surname + ' ' + req.body.name + ' ' + req.body.patronymic,
            groups: groupName
        }
    })

    const existStudent = await Student.findOne({
        where: {
            groups: groupName,
            name: req.body.surname + ' ' + req.body.name + ' ' + req.body.patronymic,
            role: req.body.role
        }
    })

    if (!dbStudent) {
        res.status(400).json({message: 'Такой студент не существует.'})
        return
    }

    if (existStudent) {
        res.status(400).json({message: 'Такой студент уже зарегистрирован.'})
        return
    }

    // random unique string
    const activationLink = uuid.v4()

    const student = {
        id: dbStudent.dataValues.id,
        activation_link: activationLink,
        groups: groupName,
        active: false,
        name: dbStudent.dataValues.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        is_head_student: dbStudent.dataValues.is_head_student,
    };

    try {
        await Student.create(student)
        const emailSent = await mailService.sendActivationMail(student.email, `${process.env.HOST_NAME}:${process.env.PORT}/activate/${activationLink}&role=${req.body.role}`)

        if (!emailSent) {
            res.status(500).json({
                message: 'Не получилось отправить письмо на указанную почту.',
                statusCode: res.statusCode,
            })

            return
        }

        res.status(201).json({message: "Регистрация прошла успешно. Для активации аккаунта перейдите по ссылке, которая пришла вам на почту."})
    } catch (err) {
        res.status(500).json({
            message: 'Не получилось зарегистрироваться.',
            error: err.message
        });
    }

}

exports.createProfessor = async (req, res, next) => {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);

        const dbTeacher = await Teacher.findOne({
            where: {
                name: req.body.name,
                surname: req.body.surname,
                patronymic: req.body.patronymic,
            }
        })

        const existTeacher = await Professor.findOne({
            where: {
                name: req.body.surname + ' ' + req.body.name + ' ' + req.body.patronymic,
                role: req.body.role
            }
        })

        if (!dbTeacher) {
            res.status(400).json({message: 'Такой преподаватель не существует.'})
            return
        }

        if (existTeacher) {
            res.status(400).json({message: 'Такой преподаватель уже зарегистрирован.'})
        }
        const activationLink = uuid.v4()

        const professor = {
            id: dbTeacher.dataValues.id,
            activation_link: activationLink,
            active: false,
            admin: false,
            name: req.body.surname + ' ' + req.body.name + ' ' + req.body.patronymic,
            email: req.body.email,
            role: req.body.role,
            password: hashedPassword
        };

        await Professor.create(professor)
        const emailSent = await mailService.sendActivationMail(professor.email, `${process.env.HOST_NAME}:${process.env.PORT}/activate/${activationLink}&role=${req.body.role}`)

        if (!emailSent) {
            res.status(500).json({
                message: 'Не получилось отправить письмо на указанную почту.',
                statusCode: res.statusCode,
            })

            return
        }

        res.status(201).json({message: "Регистрация прошла успешно. Для активации аккаунта перейдите по ссылке, которая пришла вам на почту."})
    } catch (err) {
        res.status(400).json({message: 'Не получилось зарегистрироваться.'})
    }
}

exports.getEmailByParams = async (req, res) => {
    const data = req.params.data

    if (!data) {
        res.status(400).json({
            message: 'Убедитесь в правильности запрашиваемых данных.',
            statusCode: res.statusCode,
        })

        return
    }

    const [recovery_link, role] = data.split('&role=', 2)

    let user
    if (role === 'Студент') {
        user = await Student.findOne({
            where: {
                activation_link: recovery_link,
            }
        })
    } else if (role === 'Преподаватель') {
        user = await Professor.findOne({
            where: {
                activation_link: recovery_link,
            }
        })
    } else {
        res.status(400).json({
            message: "Убедитесь в правильности запрашиваемых данных.",
            statusCode: res.statusCode
        })

        return
    }

    if (!user) {
        res.status(400).json({
            message: "Убедитесь в правильности введеных данных",
            statusCode: res.statusCode
        })

        return
    }

    res.status(200).json({
        email: user.email,
        role: user.role,
        statusCode: res.statusCode
    })
}

exports.setNewPasswordByRecovery = async (req, res) => {
    try {
        const {role, email} = req.body
        if (!email || !role) {
            res.status(400).json({
                message: "Убедитесь в правильности запрашиваемых данных.",
                statusCode: res.statusCode,
            })

            return
        }

        let user
        if (role === 'Студент') {
            user = await Student.findOne({
                where: {
                    email: email,
                }
            })
        } else if (role === 'Преподаватель') {
            user = await Professor.findOne({
                where: {
                    email: email,
                }
            })
        } else {
            res.status(400).json({
                message: "Убедитесь в правильности запрашиваемых данных.",
                statusCode: res.statusCode
            })

            return
        }

        if (!user) {
            res.status(400).json({
                message: "Убедитесь в правильности введеных данных",
                statusCode: res.statusCode
            })

            return
        }

        req.user = {
            email: user.email,
            role: user.role === 'Студент' ? 'Student' : 'Professor',
            id: user.id,
            activation_link: user.activation_link,
            password: user.password
        }

        req.body.recovery = process.env.RECOVERY_SECRET

        await recoveryService.changePassword(req, res)
    } catch (err) {
        res.status(500).json({
            message: "Что-то пошло не так.",
            statusCode: res.statusCode,
        })
    }

}