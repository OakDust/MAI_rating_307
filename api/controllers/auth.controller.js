const Professor = require('../models/professor')
const Student = require('../models/student')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const studentService = require('../service/student.service')

function passRole(is_head_student) {
    return is_head_student ? 'Староста' : 'Студент'
}

const generateAccessToken = (id, role, email, password, active, activation_link) => {
    const payload = {
        id, role, email, password, active, activation_link
    }

    return jwt.sign(payload, process.env.AUTH_SECRET, {expiresIn: '4h'})
}

exports.professorAuth = async (req, res, next) => {
    // console.log(req.body)
    // if (req.body.role !== 'Преподаватель') {
    //     res.status(401).json({
    //         message: 'Недостаточно прав для просмотра страницы.',
    //         statusCode: res.statusCode
    //     })
    //
    //     return
    // }

    const professor = await Professor.findOne({
        logging: false,
        where: {
            email: req.body.email
        }
    })

    if (!professor) {
        await res.status(400).json({
            message: "Пользователь не существует",
            token: false,
            statusCode: res.statusCode,
        })
        return
    }

    if (!professor.dataValues.active) {
        res.status(403).json({
            message: "Необходимо подтвердить адрес электронной почты.",
            statusCode: res.statusCode
        })

        return
    }

    const validPasswordProfessor = bcrypt.compareSync(req.body.password, professor.password);

    if (!validPasswordProfessor) {
        await res.status(400).json({
            message: "Логин или пароль введен неправильно!",
            token: false,
            statusCode: res.statusCode,
        })
        return
    }

    let role = 'Professor'
    if (professor.admin) {
        role = 'Administrator'
    }

    const token = await generateAccessToken(professor.id, role, professor.email, professor.password, professor.active, professor.activation_link)

    const professorData = {
        id: professor.dataValues.id,
        name: professor.dataValues.name,
        email: professor.dataValues.email,
        role: professor.dataValues.role
    }

    await res.json({
        user: professorData,
        statusCode: res.statusCode,
        message: false,
        token: 'Bearer ' + token
    })
}

exports.studentAuth = async (req, res, next) => {
    try {
        const student = await Student.findOne({
            logging: false,
            where: {
                email: req.body.email
            }
        })

        if (!student) {
            res.status(400).json({
                message: "Пользователь не существует",
                token: false,
                statusCode: res.statusCode,
            })
            return
        }

        if (!student.dataValues.active) {
            res.status(403).json({
                message: "Необходимо подтвердить адрес электронной почты.",
                statusCode: res.statusCode
            })

            return
        }

        const validPasswordStudent = bcrypt.compareSync(req.body.password, student.password);

        if (!validPasswordStudent) {
            await res.status(400).json({
                message: "Логин или пароль введен неправильно!",
                token: false,
                statusCode: res.statusCode,
            })
            return
        }

        const token = await generateAccessToken(student.id, 'Student', student.email, student.password, student.active, student.activation_link)

        const role = passRole(student.dataValues.is_head_student)

        const groupNameParticials = student.dataValues.groups.split('-', 3)

        // let year = new Date().getFullYear()
        // if (process.env.CURRENT_YEAR_CRUD_DB === 'load_22'){
        //     year -= 1
        // }

        // const groupName = groupNameParticials[0] + '-' + String(process.env.CURRENT_YEAR % 2000 - Number(groupNameParticials[2]) + 1) + groupNameParticials[1] + '-' + groupNameParticials[2]
        const groupName = studentService.getGroupName(groupNameParticials)

        const groupId = await studentService.getGroupId(groupName)

        const studentData = {
            id: student.dataValues.id,
            name: student.dataValues.name,
            email: student.dataValues.email,
            role: role,
            groups: student.dataValues.groups,
            group_id: groupId,
            is_head_student: student.dataValues.is_head_student
        }

        res.status(200).json({
            user: studentData,
            statusCode: res.statusCode,
            message: false,
            token: 'Bearer ' + token
        })
    } catch (err) {
        res.status(500).json({
            statusCode: res.statusCode,
            message: err.stack,
        })
    }
}