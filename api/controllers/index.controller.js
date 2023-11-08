const Student = require('../models/student')
const Professor = require('../models/professor')
const studentController = require('../controllers/student.controller')
const bcrypt = require('bcryptjs')


exports.create = async (req, res) => {
    if (!(req.body.id && req.body.name && req.body.email && req.body.password)) {
        res.status(400).send({
          message: "Allow null is false can not be empty!"
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
                req.body.is_head_student = await studentController.checkHeadStudent(req, res)

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

        case 'Преподаватель':
            const professor = {
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            };

            await Professor.create(professor)
                .then(data => {
                    res.status(201).redirect(process.env.REACT_APP_API_URL);
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                        err.message
                    });
                });
            break;
      
        default:
            break;
      }
}