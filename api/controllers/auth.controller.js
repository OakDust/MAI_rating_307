const Professor = require('../models/professor')
const Student = require('../models/student')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


function passRole(is_head_student) {
    return is_head_student ? 'Староста' : 'Студент'
}

const generateAccessToken = (id, role) => {
    const payload = {
        id, role
    }

    return jwt.sign(payload, process.env.AUTH_SECRET, {expiresIn: '4h'})
}

exports.professorAuth = async (req, res, next) => {
    const professor = await Professor.findOne({
        where: {
            email: req.body.email
        }
    })

    if (!professor) {
        await res.status(400).json({
            message: "Пользователь не существует",
            token: false
        })
        return
    }

    const validPasswordProfessor = bcrypt.compareSync(req.body.password, professor.password);

    if (!validPasswordProfessor) {
        await res.status(400).json({
            message: "Логин или пароль введен неправильно!",
            token: false
        })
        return
    }

    const token = await generateAccessToken(professor.id, req.body.role)

    await res.json({
        message: false,
        token: token
    })
}

exports.studentAuth = async (req, res, next) => {
    try {
        const student = await Student.findOne({
            where: {
                email: req.body.email
            }
        })

        if (!student) {
            await res.status(400).json({
                message: "Пользователь не существует",
                token: false
            })
            return
        }

        const validPasswordStudent = bcrypt.compareSync(req.body.password, student.password);

        if (!validPasswordStudent) {
            await res.status(400).json({
                message: "Логин или пароль введен неправильно!",
                token: false
            })
            return
        }

        const token = await generateAccessToken(student.id, 'Student')

        const role = passRole(student.dataValues.is_head_student)

        const studentData = {
            id: student.dataValues.id,
            name: student.dataValues.name,
            email: student.dataValues.email,
            password: student.dataValues.password,
            role: role,
            groups: student.dataValues.groups,
            is_head_student: student.dataValues.is_head_student,
            createdAt: student.dataValues.createdAt,
            updatedAt: student.dataValues.updatedAt
        }

        res.status(200).json({
            user: studentData,
            message: false,
            token: 'Student ' + token
        })
    } catch (err) {
        res.status(500).json({message: err.stack})
    }

}