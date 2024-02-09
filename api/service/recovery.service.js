const bcrypt = require("bcryptjs");
const Student = require("../models/student");
const Professor = require("../models/professor");


exports.changePassword = async (req, res) => {
    if (req.body.recovery !== process.env.RECOVERY_SECRET) {
        const validPassword = bcrypt.compareSync(req.body.old_password, req.user.password);

        if (!validPassword) {
            res.status(400).json({
                message: 'Неправильный пароль.',
                statusCode: res.statusCode,
            })

            return
        }
    }

    const newHashedPassword = bcrypt.hashSync(req.body.new_password, 10);

    if (req.user.role === 'Student') {
        const userData = {
            id: req.user.id,
            activation_link: req.user.activation_link,
            email: req.user.email,
            password: req.user.password
        }

        try {
            const student = await Student.findOne({
                where: userData
            })

            if (!student) {
                res.status(400).json({
                    message: 'Проверьте данные. Не получается обновить пароль.',
                    statusCode: res.statusCode,
                })

                return
            }

            student.password = newHashedPassword

            await student.save()
        } catch (err) {
            res.status(500).json({
                message: 'Что-то пошло не так...',
                statusCode: res.statusCode,
                err: err.stack
            })

            return
        }


    } else if (req.user.role === 'Professor') {
        const userData = {
            name: req.user.name,
            id: req.user.id,
            activation_link: req.user.activation_link,
            email: req.user.email,
            password: req.user.password
        }

        try {
            const professor = await Professor.findOne({
                where: userData
            })

            if (!professor) {
                res.status(400).json({
                    message: 'Проверьте данные. Не получается обновить пароль.',
                    statusCode: res.statusCode,
                })

                return
            }

            professor.dataValues.password = newHashedPassword

            await professor.save()
        } catch (err) {
            res.status(500).json({
                message: 'Что-то пошло не так...',
                statusCode: res.statusCode,
            })

            return
        }
    }

    res.status(200).json({
        message: 'Пароль изменен успешно.',
        statusCode: res.statusCode,
    })
}