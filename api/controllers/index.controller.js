const Student = require('../models/student')
const Professor = require('../models/professor')
const service = require('../service/index.service')
const bcrypt = require('bcryptjs')
const Teacher = require("../models/teacher");
const Groups = require("../models/groups");


exports.getGroupsList = async (req, res) => {
    try {
        const groupsList = await Groups.findAll()

        const groups = []

        for (const group of groupsList) {
            groups.push({
                group_id: group.dataValues.id,
                group_name: group.dataValues.name
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
    if (!(req.body.name && req.body.email && req.body.password && req.body.role)) {
        res.status(400).send({
          message: "Заполните все поля."
        });
        return;
      }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    switch (req.body.role) {
        case 'Студент':
            const student = {
                groups: req.body.groups,
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role,
                is_head_student: req.body.is_head_student
            };

            Student.create(student)
                .then(data => {
                    res.status(201).redirect(process.env.REACT_APP_API_URL);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message
                });
            });

            break;

          case 'Староста':
                // if headstudent does already exist
                req.body.is_head_student = await service.checkHeadStudent(req, res)

                if (req.body.is_head_student) {
                    res.status(403).json({
                        message: 'Head student already exists in this group'
                    })
                    break
                } 

                const headStudent = {
                    groups: req.body.groups,
                    id: req.body.id,
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                    role: req.body.role,
                    is_head_student: req.body.is_head_student
                };

                await Student.create(headStudent)
                    .then(data => {
                        res.status(201).redirect(process.env.REACT_APP_API_URL);
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message
                    });
                });

                break;

        default:
            break;
      }
}

exports.createProfessor = async (req, res, next) => {
    if (!(req.body.name && req.body.email && req.body.password && req.body.role)) {
        res.status(400).send({
            message: "Allow null is false can not be empty!"
        });
        return;
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    try {
        const [surname, name, patronymic] = req.body.name.split(' ')
        const teacherInDB = await Teacher.findOne({
            where: {
                name: name,
                surname: surname,
                patronymic: patronymic,
            }
        })

        if (teacherInDB) {
            const professor = {
                id: teacherInDB.id,
                name: req.body.name,
                email: req.body.email,
                role: req.body.role,
                password: hashedPassword
            };

            await Professor.create(professor)
                .then(data => {
                    res.status(201).redirect(process.env.REACT_APP_API_URL);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message
                    });
                });
        }
    } catch (err) {
        res.status(400).json({message: err.stack})
    }
}