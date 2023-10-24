const Student = require('../models/student')
const Professor = require('../models/professor')
const studentController = require('../controllers/student.controller')
const bcrypt = require('bcryptjs')


exports.create = (req, res) => {
    if (!(req.body.id && req.body.name && req.body.email && req.body.password)) {
        res.status(400).send({
          message: "Allow null is false can not be empty!"
        });
        return;
      }


      switch (req.body.entity) {
        case 'Студент':
            const hashedPasswordStudent = bcrypt.hashSync(req.body.password, 10);

            const student = {
                s_id: req.body.id,
                s_name: req.body.name,
                s_email: req.body.email,
                s_password: hashedPasswordStudent,
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
                const check = studentController.checkHeadStudent

                if (check) {
                    console.log('already exists')
                    res.status(403).end()
                    break
                } 

                req.body.is_head_student = true

                const hashedPasswordHeadStudent = bcrypt.hashSync(req.body.password, 10);

                const headStudent = {
                    s_id: req.body.id,
                    s_name: req.body.name,
                    s_email: req.body.email,
                    s_password: hashedPasswordHeadStudent,
                    is_head_student: req.body.is_head_student
                };

                Student.create(headStudent)
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

        case 'Преподаватель':

            const hashedPasswordProfessor = bcrypt.hashSync(req.body.password, 10);

            const professor = {
                p_id: req.body.id,
                p_name: req.body.name,
                p_email: req.body.email,
                p_password: hashedPasswordProfessor
            };

            Professor.create(professor)
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