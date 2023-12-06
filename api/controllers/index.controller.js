const Student = require('../models/student')
const Professor = require('../models/professor')
const service = require('../service/index.service')
const bcrypt = require('bcryptjs')
const Teacher = require("../models/teacher");
const Groups = require("../models/groups");
const StudentsByGroups = require("../models/studentsByGroups");
const {Op} = require("sequelize");


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

    if (!req.body.groups) {
        res.status(400).json({message: 'Укажите группу'})
        return
    }

    const dbStudent = await StudentsByGroups.findOne({
        where: {
            name: req.body.surname + ' ' + req.body.name + ' ' + req.body.patronymic,
            groups: req.body.groups
        }
    })

    const existStudent = await Student.findOne({
        where: {
            groups: req.body.groups,
            name: req.body.name,
            role: req.body.role
        }
    })

    if (!dbStudent || existStudent) {
        res.status(400).json({message: 'Такой студент не существует.'})
        return
    }

    const student = {
        id: dbStudent.dataValues.id,
        groups: req.body.groups,
        name: dbStudent.dataValues.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        is_head_student: dbStudent.dataValues.is_head_student,
    };

    try {
        await Student.create(student)
        res.status(201).json({message: 'Регистрация прошла успешно.'})
    } catch (err) {
        res.status(500).json({message: 'Не получилось зарегистрироваться.'});
    }

}

exports.createProfessor = async (req, res, next) => {
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

    if (!dbTeacher || existTeacher) {
        res.status(400).json({message: 'Такой преподаватель не существует.'})
        return
    }

    try {
        const professor = {
            id: dbTeacher.dataValues.id,
            name: req.body.surname + ' ' + req.body.name + ' ' + req.body.patronymic,
            email: req.body.email,
            role: req.body.role,
            password: hashedPassword
        };

        await Professor.create(professor)
        res.status(201).json({message: 'Регистрация прошла успешно.'})
    } catch (err) {
        res.status(400).json({message: 'Не получилось зарегистрироваться.'})
    }
}